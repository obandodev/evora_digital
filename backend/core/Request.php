<?php
class Request
{
    // Body JSON (para peticiones application/json: login, categorías, pedidos)
    public static function body(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        return is_array($data) ? $data : [];
    }

    public static function method(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    // Trae un valor del body JSON con default
    public static function get(string $key, $default = null)
    {
        $body = self::body();
        return $body[$key] ?? $default;
    }

    // Trae un valor de query string (?page=1&limit=10)
    public static function query(string $key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }

    // Trae un valor de formulario multipart/form-data (para subir imágenes)
    public static function input(string $key, $default = null)
    {
        return $_POST[$key] ?? $default;
    }

    // Trae un archivo subido (multipart/form-data)
    public static function file(string $key): ?array
    {
        if (empty($_FILES[$key]) || $_FILES[$key]['error'] === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        return $_FILES[$key];
    }
}
