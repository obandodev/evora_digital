<?php
// Variables de entorno básicas (en producción, mover a .env real)
define('DB_HOST', 'localhost');
define('DB_NAME', 'glam_beauty');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

define('APP_ENV', 'development'); // development | production

// Configuración de sesión (antes de cualquier session_start())
define('SESSION_NAME', 'glam_beauty_admin');
define('SESSION_LIFETIME', 3600); // 1 hora

// Rutas de subida de archivos
define('UPLOAD_DIR', __DIR__ . '/../uploads/products/');

$glamDocRoot = rtrim(str_replace('\\', '/', realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: ''), '/');
$glamBackendDir = str_replace('\\', '/', realpath(__DIR__ . '/..'));
$glamBackendUrl = ($glamDocRoot !== '' && stripos($glamBackendDir, $glamDocRoot) === 0)
    ? substr($glamBackendDir, strlen($glamDocRoot))
    : '';
define('UPLOAD_URL', $glamBackendUrl . '/uploads/products/');
unset($glamDocRoot, $glamBackendDir, $glamBackendUrl);

define('MAX_UPLOAD_SIZE', 3 * 1024 * 1024); // 3MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/webp']);

// Zona horaria
date_default_timezone_set('America/Bogota');

// Mostrar errores solo en desarrollo
if (APP_ENV === 'development') {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}