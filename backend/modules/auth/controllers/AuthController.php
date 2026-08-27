<?php

session_start();

require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../services/AuthService.php';

class AuthController
{
    private AuthService $authService;

    public function __construct(PDO $pdo)
    {
        $this->authService = new AuthService($pdo);
    }

    public function login(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendResponse(false, 'Método no permitido.', 405);
            return;
        }

        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        $result = $this->authService->login($email, $password);

        if (!$result['success']) {
            $this->sendResponse(false, $result['message'], 401);
            return;
        }

        session_regenerate_id(true);

        $_SESSION['admin'] = [
            'id' => $result['user']['id'],
            'name' => $result['user']['name'],
            'email' => $result['user']['email'],
            'role' => $result['user']['role']
        ];

        $this->sendResponse(
            true,
            $result['message'],
            200,
            [
                'user' => $_SESSION['admin']
            ]
        );
    }

    public function logout(): void
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();

            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();

        $this->sendResponse(
            true,
            'Sesión cerrada correctamente.'
        );
    }

    private function sendResponse(
        bool $success,
        string $message,
        int $statusCode = 200,
        array $data = []
    ): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => $success,
            'message' => $message,
            'data' => $data
        ]);
    }
}