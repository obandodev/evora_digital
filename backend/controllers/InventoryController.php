<?php
require_once __DIR__ . '/../models/Inventory.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class InventoryController
{
    private Inventory $model;

    public function __construct()
    {
        $this->model = new Inventory();
    }

    // Historial de movimientos (todos, o filtrado por producto: ?product_id=5)
    public function index(): void
    {
        AuthMiddleware::handle();
        $productId = Request::query('product_id');
        Response::success($this->model->getMovements($productId ? (int) $productId : null));
    }

    // Ajuste manual de stock por parte del admin (ENTRY o ADJUSTMENT)
    public function adjust(): void
    {
        AuthMiddleware::handle();

        $productId = (int) Request::get('product_id', 0);
        $type = Request::get('movement_type', 'ADJUSTMENT'); // ENTRY | ADJUSTMENT
        $quantity = (int) Request::get('quantity', 0);
        $description = Request::get('description');

        if ($productId <= 0 || $quantity <= 0) {
            Response::error('Producto y cantidad son obligatorios', 422);
        }
        if (!in_array($type, ['ENTRY', 'ADJUSTMENT'], true)) {
            Response::error('Tipo de movimiento inválido', 422);
        }

        $inventory = $this->model->getByProduct($productId);
        if (!$inventory) {
            Response::error('El producto no tiene inventario configurado', 404);
        }

        $previousStock = (int) $inventory['stock'];
        // ENTRY siempre suma; ADJUSTMENT puede usarse para corregir un conteo (se trata como valor absoluto sumado también,
        // para restar usa un ajuste con descripción negativa vía "quantity" y movement_type ADJUSTMENT en un flujo futuro más fino)
        $newStock = $previousStock + $quantity;

        try {
            $this->model->setStock($productId, $newStock);
            $this->model->registerMovement([
                'product_id'     => $productId,
                'user_id'        => $_SESSION['user_id'],
                'movement_type'  => $type,
                'quantity'       => $quantity,
                'previous_stock' => $previousStock,
                'new_stock'      => $newStock,
                'description'    => $description,
            ]);
            Response::success(['new_stock' => $newStock], 'Inventario actualizado correctamente');
        } catch (PDOException $e) {
            error_log('Inventory adjust error: ' . $e->getMessage());
            Response::error('Error al ajustar el inventario', 500);
        }
    }
}
