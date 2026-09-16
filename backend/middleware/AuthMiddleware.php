<?php
require_once __DIR__ . '/../core/Response.php';

class AuthMiddleware
{
    public static function handle(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_name(SESSION_NAME);
            session_start();
        }

        if (empty($_SESSION['user_id'])) {
            Response::error('No autorizado, inicia sesión', 401);
        }
    }

    public static function requireRole(array $roles): void
    {
        self::handle();
        if (!in_array($_SESSION['role'] ?? '', $roles, true)) {
            Response::error('No tienes permisos para esta acción', 403);
        }
    }
}
