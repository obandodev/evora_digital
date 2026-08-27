<?php

require_once __DIR__ . '/controllers/AuthController.php';

$controller = new AuthController($pdo);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $controller->login();
        break;

    case 'logout':
        $controller->logout();
        break;

    default:
        http_response_code(404);

        header('Content-Type: application/json; charset=utf-8');

        echo json_encode([
            'success' => false,
            'message' => 'Acción no encontrada.'
        ]);
        break;
}