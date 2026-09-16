<?php
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class CategoryController
{
    private Category $model;

    public function __construct()
    {
        $this->model = new Category();
    }

    public function index(): void
    {
        Response::success($this->model->getAll(true));
    }

    public function adminIndex(): void
    {
        AuthMiddleware::handle();
        Response::success($this->model->getAll(false));
    }

    public function show(string $id): void
    {
        $category = $this->model->getById((int) $id);
        if (!$category) {
            Response::error('Categoría no encontrada', 404);
        }
        Response::success($category);
    }

    public function store(): void
    {
        AuthMiddleware::handle();

        $name = trim(Request::get('name', ''));
        if ($name === '') {
            Response::error('El nombre es obligatorio', 422);
        }

        try {
            $id = $this->model->create([
                'name'        => $name,
                'description' => Request::get('description'),
                'status'      => Request::get('status', 'ACTIVE'),
            ]);
            Response::success(['id' => $id], 'Categoría creada correctamente', 201);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                Response::error('Ya existe una categoría con ese nombre', 409);
            }
            error_log('Category create error: ' . $e->getMessage());
            Response::error('Error al crear la categoría', 500);
        }
    }

    public function update(string $id): void
    {
        AuthMiddleware::handle();

        $name = trim(Request::get('name', ''));
        if ($name === '') {
            Response::error('El nombre es obligatorio', 422);
        }

        if (!$this->model->getById((int) $id)) {
            Response::error('Categoría no encontrada', 404);
        }

        try {
            $this->model->update((int) $id, [
                'name'        => $name,
                'description' => Request::get('description'),
                'status'      => Request::get('status', 'ACTIVE'),
            ]);
            Response::success(null, 'Categoría actualizada correctamente');
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                Response::error('Ya existe una categoría con ese nombre', 409);
            }
            error_log('Category update error: ' . $e->getMessage());
            Response::error('Error al actualizar la categoría', 500);
        }
    }

    public function destroy(string $id): void
    {
        AuthMiddleware::handle();

        if (!$this->model->getById((int) $id)) {
            Response::error('Categoría no encontrada', 404);
        }

        try {
            $this->model->delete((int) $id);
            Response::success(null, 'Categoría eliminada correctamente');
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                Response::error('No se puede eliminar: hay productos asociados a esta categoría. Márcala como inactiva en su lugar.', 409);
            }
            error_log('Category delete error: ' . $e->getMessage());
            Response::error('Error al eliminar la categoría', 500);
        }
    }
}
