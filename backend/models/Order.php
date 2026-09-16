<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/Inventory.php';
require_once __DIR__ . '/Product.php';

// Excepción específica para poder distinguir "no hay stock" de un error real de BD
class InsufficientStockException extends Exception {}

class Order
{
    private PDO $db;
    private Inventory $inventoryModel;
    private Product $productModel;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->inventoryModel = new Inventory();
        $this->productModel = new Product();
    }

    /**
     * Crea un pedido completo: inserta la orden, sus detalles,
     * descuenta stock y registra el movimiento de inventario.
     * Todo dentro de una única transacción: si algo falla, no se guarda nada.
     *
     * $data = [
     *   customer_name, customer_phone, customer_email,
     *   delivery_address, delivery_city, notes, shipping_cost,
     *   items => [ ['product_id' => X, 'quantity' => Y], ... ]
     * ]
     */
    public function create(array $data): array
    {
        if (empty($data['items']) || !is_array($data['items'])) {
            throw new InvalidArgumentException('El pedido debe tener al menos un producto');
        }

        $this->db->beginTransaction();

        try {
            $subtotal = 0.0;
            $orderItems = [];

            // 1. Validar stock y calcular subtotal de cada producto (con bloqueo de fila)
            foreach ($data['items'] as $item) {
                $productId = (int) $item['product_id'];
                $quantity = (int) $item['quantity'];

                if ($quantity <= 0) {
                    throw new InvalidArgumentException('La cantidad debe ser mayor a cero');
                }

                $inventory = $this->inventoryModel->lockForUpdate($productId);
                if (!$inventory) {
                    throw new InvalidArgumentException("El producto ID $productId no tiene inventario configurado");
                }

                if ($inventory['stock'] < $quantity) {
                    throw new InsufficientStockException("Stock insuficiente para el producto ID $productId (disponible: {$inventory['stock']})");
                }

                $price = $this->productModel->getPrice($productId);
                if ($price === null) {
                    throw new InvalidArgumentException("El producto ID $productId no existe");
                }

                $lineSubtotal = round($price * $quantity, 2);
                $subtotal += $lineSubtotal;

                $orderItems[] = [
                    'product_id'     => $productId,
                    'quantity'       => $quantity,
                    'unit_price'     => $price,
                    'subtotal'       => $lineSubtotal,
                    'previous_stock' => $inventory['stock'],
                    'new_stock'      => $inventory['stock'] - $quantity,
                ];
            }

            $shippingCost = (float) ($data['shipping_cost'] ?? 0);
            $total = round($subtotal + $shippingCost, 2);
            $orderCode = 'GB-' . strtoupper(bin2hex(random_bytes(4)));

            // 2. Insertar la orden
            $stmt = $this->db->prepare(
                'INSERT INTO orders
                    (order_code, customer_name, customer_phone, customer_email,
                     delivery_address, delivery_city, status, subtotal, shipping_cost, total, notes)
                 VALUES
                    (:order_code, :customer_name, :customer_phone, :customer_email,
                     :delivery_address, :delivery_city, :status, :subtotal, :shipping_cost, :total, :notes)'
            );
            $stmt->execute([
                'order_code'       => $orderCode,
                'customer_name'    => $data['customer_name'],
                'customer_phone'   => $data['customer_phone'],
                'customer_email'   => $data['customer_email'] ?? null,
                'delivery_address' => $data['delivery_address'],
                'delivery_city'    => $data['delivery_city'] ?? null,
                'status'           => 'PENDING',
                'subtotal'         => $subtotal,
                'shipping_cost'    => $shippingCost,
                'total'            => $total,
                'notes'            => $data['notes'] ?? null,
            ]);
            $orderId = (int) $this->db->lastInsertId();

            // 3. Insertar detalles, descontar stock y registrar movimiento por cada producto
            $detailStmt = $this->db->prepare(
                'INSERT INTO order_details (order_id, product_id, quantity, unit_price, subtotal)
                 VALUES (:order_id, :product_id, :quantity, :unit_price, :subtotal)'
            );

            foreach ($orderItems as $item) {
                $detailStmt->execute([
                    'order_id'   => $orderId,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal'   => $item['subtotal'],
                ]);

                $this->inventoryModel->setStock($item['product_id'], $item['new_stock']);

                $this->inventoryModel->registerMovement([
                    'product_id'     => $item['product_id'],
                    'user_id'        => null, // pedido público, sin sesión de admin
                    'order_id'       => $orderId,
                    'movement_type'  => 'EXIT',
                    'quantity'       => $item['quantity'],
                    'previous_stock' => $item['previous_stock'],
                    'new_stock'      => $item['new_stock'],
                    'description'    => "Salida por pedido $orderCode",
                ]);
            }

            $this->db->commit();

            return ['id' => $orderId, 'order_code' => $orderCode, 'total' => $total];

        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function getAll(?string $status = null): array
    {
        $sql = 'SELECT * FROM orders WHERE 1=1';
        $params = [];
        if ($status) {
            $sql .= ' AND status = :status';
            $params['status'] = $status;
        }
        $sql .= ' ORDER BY created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM orders WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $order = $stmt->fetch();
        if (!$order) {
            return null;
        }

        $detailsStmt = $this->db->prepare(
            'SELECT od.*, p.name AS product_name
             FROM order_details od
             JOIN products p ON p.id = od.product_id
             WHERE od.order_id = :order_id'
        );
        $detailsStmt->execute(['order_id' => $id]);
        $order['items'] = $detailsStmt->fetchAll();

        return $order;
    }

    public function updateStatus(int $id, string $status): bool
    {
        $validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!in_array($status, $validStatuses, true)) {
            throw new InvalidArgumentException('Estado inválido');
        }

        $stmt = $this->db->prepare('UPDATE orders SET status = :status WHERE id = :id');
        return $stmt->execute(['status' => $status, 'id' => $id]);
    }
}
