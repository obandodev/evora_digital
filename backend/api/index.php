<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/InventoryController.php';
require_once __DIR__ . '/../controllers/OrderController.php';
require_once __DIR__ . '/../controllers/ReportController.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if (Request::method() === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$router = new Router();

// --- Auth ---
$router->post(
    '/auth/login',
    fn() => (new AuthController())->login()
);

$router->post(
    '/auth/logout',
    fn() => (new AuthController())->logout()
);

$router->get(
    '/auth/me',
    fn() => (new AuthController())->me()
);

// --- Categories ---
$router->get(
    '/categories',
    fn() => (new CategoryController())->index()
);

$router->get(
    '/admin/categories',
    fn() => (new CategoryController())->adminIndex()
);

$router->get(
    '/categories/{id}',
    fn($id) => (new CategoryController())->show($id)
);

$router->post(
    '/categories',
    fn() => (new CategoryController())->store()
);

$router->put(
    '/categories/{id}',
    fn($id) => (new CategoryController())->update($id)
);

$router->delete(
    '/categories/{id}',
    fn($id) => (new CategoryController())->destroy($id)
);

// --- Products ---
$router->get(
    '/products',
    fn() => (new ProductController())->index()
);

$router->get(
    '/admin/products',
    fn() => (new ProductController())->adminIndex()
);

$router->get(
    '/products/{id}',
    fn($id) => (new ProductController())->show($id)
);

$router->post(
    '/products',
    fn() => (new ProductController())->store()
);

$router->post(
    '/products/{id}',
    fn($id) => (new ProductController())->update($id)
);

$router->delete(
    '/products/{id}',
    fn($id) => (new ProductController())->destroy($id)
);

$router->delete(
    '/products/{productId}/images/{imageId}',
    fn($pid, $iid) =>
        (new ProductController())->deleteImage($pid, $iid)
);

// --- Inventory ---
$router->get(
    '/inventory/movements',
    fn() => (new InventoryController())->index()
);

$router->post(
    '/inventory/adjust',
    fn() => (new InventoryController())->adjust()
);

// --- Orders ---
$router->post(
    '/orders',
    fn() => (new OrderController())->store()
);

$router->get(
    '/admin/orders',
    fn() => (new OrderController())->index()
);

$router->get(
    '/admin/orders/{id}',
    fn($id) => (new OrderController())->show($id)
);

$router->put(
    '/admin/orders/{id}/status',
    fn($id) => (new OrderController())->updateStatus($id)
);

// --- Reports ---
$router->get(
    '/admin/reports/summary',
    fn() => (new ReportController())->summary()
);

$router->get(
    '/admin/reports/inventory',
    fn() => (new ReportController())->inventory()
);

$router->get(
    '/admin/reports/inventory/categories',
    fn() => (new ReportController())->inventoryCategories()
);

$router->get(
    '/admin/reports/sales/categories',
    fn() => (new ReportController())->salesCategories()
);

$router->get(
    '/admin/reports/sales/products',
    fn() => (new ReportController())->salesProducts()
);

$router->resolve();