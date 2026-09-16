<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';

class AuthController
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
        $this->startSession();
    }

    private function startSession(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_name(SESSION_NAME);
            session_start();
        }
    }

    public function login(): void
    {
        $email = trim(Request::get('email', ''));
        $password = Request::get('password', '');

        if ($email === '' || $password === '') {
            Response::error('Email y contraseña son obligatorios', 422);
        }

        try {
            $user = $this->userModel->findByEmail($email);

            if (!$user || $user['status'] !== 'ACTIVE') {
                Response::error('Credenciales inválidas', 401);
            }

            if (!password_verify($password, $user['password_hash'])) {
                Response::error('Credenciales inválidas', 401);
            }

            session_regenerate_id(true);

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name']    = $user['name'];
            $_SESSION['role']    = $user['role'];

            Response::success([
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ], 'Sesión iniciada correctamente');

        } catch (Exception $e) {
            error_log('Login error: ' . $e->getMessage());
            Response::error('Error al iniciar sesión', 500);
        }
    }

    public function logout(): void
    {
        $_SESSION = [];
        session_destroy();
        Response::success(null, 'Sesión cerrada correctamente');
    }

    public function me(): void
    {
        if (empty($_SESSION['user_id'])) {
            Response::error('No hay sesión activa', 401);
        }

        Response::success([
            'id'   => $_SESSION['user_id'],
            'name' => $_SESSION['name'],
            'role' => $_SESSION['role'],
        ]);
    }
}
