<?php
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/ProductImage.php';
require_once __DIR__ . '/../models/Inventory.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class ProductController
{
    private Product $model;
    private ProductImage $imageModel;
    private Inventory $inventoryModel;

    public function __construct()
    {
        $this->model = new Product();
        $this->imageModel = new ProductImage();
        $this->inventoryModel = new Inventory();
    }

    public function index(): void
    {
        $page = max(1, (int) Request::query('page', 1));
        $limit = max(1, min(50, (int) Request::query('limit', 12)));
        $offset = ($page - 1) * $limit;

        $filters = [
            'category_id' => Request::query('category_id'),
            'brand' => Request::query('brand'),
            'search' => Request::query('search')
        ];

        $products = $this->model->getAll($filters, true, $limit, $offset);
        $total = $this->model->count($filters, true);

        foreach ($products as &$product) {
            $product['images'] = $this->imageModel->getByProduct($product['id']);
        }

        Response::success([
            'items' => $products,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => (int) ceil($total / $limit)
            ]
        ]);
    }

    public function adminIndex(): void
    {
        AuthMiddleware::handle();

        $page = max(1, (int) Request::query('page', 1));
        $limit = max(1, min(100, (int) Request::query('limit', 20)));
        $offset = ($page - 1) * $limit;

        $filters = [
            'category_id' => Request::query('category_id'),
            'brand' => Request::query('brand'),
            'search' => Request::query('search')
        ];

        $products = $this->model->getAll($filters, false, $limit, $offset);
        $total = $this->model->count($filters, false);

        Response::success([
            'items' => $products,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'total_pages' => (int) ceil($total / $limit)
            ]
        ]);
    }

    public function show(string $id): void
    {
        $product = $this->model->getById((int) $id);

        if (!$product) {
            Response::error('Producto no encontrado', 404);
        }

        $product['images'] = $this->imageModel->getByProduct((int) $id);

        Response::success($product);
    }

    public function store(): void
    {
        AuthMiddleware::handle();

        $name = trim(Request::input('name', ''));
        $categoryId = (int) Request::input('category_id', 0);
        $price = Request::input('price');
        $initialStock = (int) Request::input('stock', 0);
        $file = Request::file('image');

        if ($name === '' || $categoryId <= 0 || $price === null) {
            Response::error(
                'Nombre, categoría y precio son obligatorios',
                422
            );
        }

        if ($initialStock < 0) {
            Response::error(
                'El stock no puede ser negativo',
                422
            );
        }

        try {
            $duplicates = $this->model->getByNameAndPrice($name, $price);

            foreach ($duplicates as $duplicate) {
                if (!$file || empty($duplicate['image_path'])) {
                    continue;
                }

                if ($this->sameImage($file, $duplicate['image_path'])) {
                    $productId = (int) $duplicate['id'];

                    $inventory = $this->inventoryModel->getByProduct($productId);

                    if (!$inventory) {
                        $this->inventoryModel->create(
                            $productId,
                            $initialStock
                        );

                        Response::success([
                            'id' => $productId,
                            'merged' => true,
                            'stock_added' => $initialStock
                        ], 'El producto ya existía. Se creó su inventario correctamente.');
                    }

                    if ($initialStock > 0) {
                        $stockData = $this->inventoryModel->addStock(
                            $productId,
                            $initialStock
                        );

                        if (!$stockData) {
                            Response::error(
                                'No fue posible actualizar el inventario',
                                500
                            );
                        }

                        $this->inventoryModel->registerMovement([
                            'product_id' => $productId,
                            'user_id' => $_SESSION['user_id'] ?? null,
                            'movement_type' => 'ENTRY',
                            'quantity' => $initialStock,
                            'previous_stock' => $stockData['previous_stock'],
                            'new_stock' => $stockData['new_stock'],
                            'description' => 'Stock agregado al producto existente'
                        ]);

                        Response::success([
                            'id' => $productId,
                            'merged' => true,
                            'stock_added' => $initialStock,
                            'previous_stock' => $stockData['previous_stock'],
                            'new_stock' => $stockData['new_stock']
                        ], 'El producto ya existía. Se agregó el nuevo stock.');
                    }

                    Response::success([
                        'id' => $productId,
                        'merged' => true,
                        'stock_added' => 0
                    ], 'El producto ya existe. No se creó un duplicado.');
                }
            }

            $productId = $this->model->create([
                'category_id' => $categoryId,
                'brand' => Request::input('brand'),
                'name' => $name,
                'description' => Request::input('description'),
                'price' => $price,
                'color' => Request::input('color'),
                'status' => Request::input('status', 'ACTIVE'),
            ]);

            $this->inventoryModel->create(
                $productId,
                $initialStock
            );

            if ($file) {
                $this->handleImageUpload(
                    $file,
                    $productId,
                    true
                );
            }

            Response::success(
                ['id' => $productId, 'merged' => false],
                'Producto creado correctamente',
                201
            );
        } catch (RuntimeException $e) {
            Response::error($e->getMessage(), 422);
        } catch (PDOException $e) {
            error_log('Product create error: ' . $e->getMessage());

            Response::error(
                'Error al crear el producto',
                500
            );
        }
    }

    public function update(string $id): void
    {
        AuthMiddleware::handle();

        $productId = (int) $id;

        if (!$this->model->getById($productId)) {
            Response::error('Producto no encontrado', 404);
        }

        $name = trim(Request::input('name', ''));
        $categoryId = (int) Request::input('category_id', 0);
        $price = Request::input('price');

        if ($name === '' || $categoryId <= 0 || $price === null) {
            Response::error(
                'Nombre, categoría y precio son obligatorios',
                422
            );
        }

        try {
            $this->model->update($productId, [
                'category_id' => $categoryId,
                'brand' => Request::input('brand'),
                'name' => $name,
                'description' => Request::input('description'),
                'price' => $price,
                'color' => Request::input('color'),
                'status' => Request::input('status', 'ACTIVE')
            ]);

            $file = Request::file('image');

            if ($file) {
                $this->handleImageUpload(
                    $file,
                    $productId,
                    true
                );
            }

            Response::success(
                null,
                'Producto actualizado correctamente'
            );
        } catch (RuntimeException $e) {
            Response::error($e->getMessage(), 422);
        } catch (PDOException $e) {
            error_log('Product update error: ' . $e->getMessage());

            Response::error(
                'Error al actualizar el producto',
                500
            );
        }
    }

    public function destroy(string $id): void
    {
        AuthMiddleware::handle();

        $productId = (int) $id;

        if (!$this->model->getById($productId)) {
            Response::error('Producto no encontrado', 404);
        }

        try {
            $this->model->delete($productId);

            Response::success(
                null,
                'Producto eliminado correctamente'
            );
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                Response::error(
                    'No se puede eliminar: el producto tiene pedidos asociados. Márcalo como inactivo en su lugar.',
                    409
                );
            }

            error_log(
                'Product delete error: ' . $e->getMessage()
            );

            Response::error(
                'Error al eliminar el producto',
                500
            );
        }
    }

    public function deleteImage(string $productId, string $imageId): void
    {
        AuthMiddleware::handle();

        $image = $this->imageModel->getById((int) $imageId);

        if (!$image || $image['product_id'] != $productId) {
            Response::error('Imagen no encontrada', 404);
        }

        $filePath = UPLOAD_DIR . basename($image['image_path']);

        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $this->imageModel->delete((int) $imageId);

        Response::success(
            null,
            'Imagen eliminada correctamente'
        );
    }

    private function sameImage(array $file, string $existingImage): bool
    {
        if (
            empty($file['tmp_name']) ||
            !is_uploaded_file($file['tmp_name'])
        ) {
            return false;
        }

        $existingPath = UPLOAD_DIR . basename($existingImage);

        if (!file_exists($existingPath)) {
            return false;
        }

        $newHash = hash_file(
            'sha256',
            $file['tmp_name']
        );

        $existingHash = hash_file(
            'sha256',
            $existingPath
        );

        return $newHash !== false &&
            $existingHash !== false &&
            hash_equals($existingHash, $newHash);
    }

    private function handleImageUpload(
        array $file,
        int $productId,
        bool $isPrimary
    ): void {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new RuntimeException(
                'Error al subir el archivo (código ' . $file['error'] . ')'
            );
        }

        if ($file['size'] > MAX_UPLOAD_SIZE) {
            throw new RuntimeException(
                'La imagen no debe superar los ' .
                (MAX_UPLOAD_SIZE / 1024 / 1024) .
                'MB'
            );
        }

        $mimeType = mime_content_type(
            $file['tmp_name']
        );

        if (!in_array(
            $mimeType,
            ALLOWED_IMAGE_TYPES,
            true
        )) {
            throw new RuntimeException(
                'Formato de imagen no permitido. Usa JPG, PNG o WEBP'
            );
        }

        if (!is_dir(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0755, true);
        }

        $extension = pathinfo(
            $file['name'],
            PATHINFO_EXTENSION
        );

        $fileName =
            'product_' .
            $productId .
            '_' .
            uniqid() .
            '.' .
            $extension;

        $destination = UPLOAD_DIR . $fileName;

        if (!move_uploaded_file(
            $file['tmp_name'],
            $destination
        )) {
            throw new RuntimeException(
                'No se pudo guardar la imagen en el servidor'
            );
        }

        $this->imageModel->add(
            $productId,
            $fileName,
            $isPrimary
        );
    }
}