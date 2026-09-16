<?php
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class OrderController
{
    private Order $model;

    public function __construct()
    {
        $this->model = new Order();
    }

    // Público: crear pedido sin login. Descuenta stock automáticamente (transacción).
    public function store(): void
    {
        $body = Request::body();

        $required = ['customer_name', 'customer_phone', 'delivery_address', 'items'];
        foreach ($required as $field) {
            if (empty($body[$field])) {
                Response::error("El campo '$field' es obligatorio", 422);
            }
        }

        try {
            $result = $this->model->create($body);
            Response::success($result, 'Pedido creado correctamente', 201);

        } catch (InsufficientStockException $e) {
            Response::error($e->getMessage(), 409);
        } catch (InvalidArgumentException $e) {
            Response::error($e->getMessage(), 422);
        } catch (Exception $e) {
            error_log('Order create error: ' . $e->getMessage());
            Response::error('Error al procesar el pedido', 500);
        }
    }

    // Admin: listar pedidos, opcionalmente filtrados por estado
    public function index(): void
    {
        AuthMiddleware::handle();
        $status = Request::query('status');
        Response::success($this->model->getAll($status));
    }

    public function show(string $id): void
    {
        AuthMiddleware::handle();
        $order = $this->model->getById((int) $id);
        if (!$order) {
            Response::error('Pedido no encontrado', 404);
        }
        Response::success($order);
    }

    public function updateStatus(string $id): void
    {
        AuthMiddleware::handle();
        $status = Request::get('status', '');

        try {
            if (!$this->model->getById((int) $id)) {
                Response::error('Pedido no encontrado', 404);
            }
            $this->model->updateStatus((int) $id, $status);
            Response::success(null, 'Estado del pedido actualizado');
        } catch (InvalidArgumentException $e) {
            Response::error($e->getMessage(), 422);
        } catch (PDOException $e) {
            error_log('Order status update error: ' . $e->getMessage());
            Response::error('Error al actualizar el estado del pedido', 500);
        }
    }
}
