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

        $parentId = $this->readParentId();
        $this->validateParent($parentId);

        try {
            $id = $this->model->create([
                'parent_id'   => $parentId,
                'name'        => $name,
                'description' => Request::get('description'),
                'status'      => Request::get('status', 'ACTIVE'),
            ]);
            Response::success(['id' => $id], 'Categoría creada correctamente', 201);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                Response::error('Ya existe una categoría con ese nombre en este nivel', 409);
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

        $parentId = $this->readParentId();
        $this->validateParent($parentId, (int) $id);

        try {
            $this->model->update((int) $id, [
                'parent_id'   => $parentId,
                'name'        => $name,
                'description' => Request::get('description'),
                'status'      => Request::get('status', 'ACTIVE'),
            ]);
            Response::success(null, 'Categoría actualizada correctamente');
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                Response::error('Ya existe una categoría con ese nombre en este nivel', 409);
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

        if ($this->model->hasChildren((int) $id)) {
            Response::error('No se puede eliminar: esta categoría tiene subcategorías. Elimina o mueve primero las subcategorías.', 409);
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

    /**
     * Lee parent_id del body. Vacío, 0 o null = categoría principal.
     */
    private function readParentId(): ?int
    {
        $raw = Request::get('parent_id');

        if ($raw === null || $raw === '' || (int) $raw === 0) {
            return null;
        }

        return (int) $raw;
    }

    /**
     * Solo se permiten dos niveles: categoría y subcategoría.
     */
    private function validateParent(?int $parentId, ?int $selfId = null): void
    {
        if ($parentId === null) {
            return;
        }

        if ($selfId !== null && $parentId === $selfId) {
            Response::error('Una categoría no puede ser su propia subcategoría', 422);
        }

        $parent = $this->model->getById($parentId);

        if (!$parent) {
            Response::error('La categoría padre no existe', 422);
        }

        if ($parent['parent_id'] !== null) {
            Response::error('Solo se permiten dos niveles: la categoría padre no puede ser una subcategoría', 422);
        }

        if ($selfId !== null && $this->model->hasChildren($selfId)) {
            Response::error('Esta categoría tiene subcategorías, por lo que no puede convertirse en subcategoría', 422);
        }
    }
}