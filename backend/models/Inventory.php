<?php
require_once __DIR__ . '/../config/Database.php';

class Inventory
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function create(int $productId, int $initialStock = 0, int $minimumStock = 5): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO inventory
                (product_id, stock, minimum_stock)
             VALUES
                (:product_id, :stock, :minimum_stock)'
        );

        $stmt->execute([
            'product_id' => $productId,
            'stock' => $initialStock,
            'minimum_stock' => $minimumStock,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function getByProduct(int $productId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT *
             FROM inventory
             WHERE product_id = :product_id'
        );

        $stmt->execute([
            'product_id' => $productId
        ]);

        return $stmt->fetch() ?: null;
    }

    public function lockForUpdate(int $productId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT *
             FROM inventory
             WHERE product_id = :product_id
             FOR UPDATE'
        );

        $stmt->execute([
            'product_id' => $productId
        ]);

        return $stmt->fetch() ?: null;
    }

    public function setStock(int $productId, int $newStock): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE inventory
             SET stock = :stock
             WHERE product_id = :product_id'
        );

        return $stmt->execute([
            'stock' => $newStock,
            'product_id' => $productId
        ]);
    }

    public function addStock(int $productId, int $quantity): ?array
    {
        if ($quantity <= 0) {
            return $this->getByProduct($productId);
        }

        $inventory = $this->lockForUpdate($productId);

        if (!$inventory) {
            return null;
        }

        $previousStock = (int) $inventory['stock'];
        $newStock = $previousStock + $quantity;

        $this->setStock($productId, $newStock);

        return [
            'previous_stock' => $previousStock,
            'quantity' => $quantity,
            'new_stock' => $newStock
        ];
    }

    public function registerMovement(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO inventory_movements
                (product_id, user_id, order_id, movement_type,
                 quantity, previous_stock, new_stock, description)
             VALUES
                (:product_id, :user_id, :order_id, :movement_type,
                 :quantity, :previous_stock, :new_stock, :description)'
        );

        $stmt->execute([
            'product_id' => $data['product_id'],
            'user_id' => $data['user_id'] ?? null,
            'order_id' => $data['order_id'] ?? null,
            'movement_type' => $data['movement_type'],
            'quantity' => $data['quantity'],
            'previous_stock' => $data['previous_stock'],
            'new_stock' => $data['new_stock'],
            'description' => $data['description'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function getMovements(?int $productId = null): array
    {
        $sql = 'SELECT im.*, p.name AS product_name, u.name AS user_name
                FROM inventory_movements im
                JOIN products p ON p.id = im.product_id
                LEFT JOIN users u ON u.id = im.user_id';

        $params = [];

        if ($productId) {
            $sql .= ' WHERE im.product_id = :product_id';
            $params['product_id'] = $productId;
        }

        $sql .= ' ORDER BY im.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }
}