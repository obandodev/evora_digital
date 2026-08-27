<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isAuthenticated(): bool
{
    return isset($_SESSION['admin']);
}

function requireAuth(): void
{
    if (!isAuthenticated()) {
        header('Location: /glam_beauty/frontend/modules/auth/pages/login.php');
        exit;
    }
}

function getAuthenticatedUser(): ?array
{
    return $_SESSION['admin'] ?? null;
}

function logoutUser(): void
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
}