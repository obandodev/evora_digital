<?php

require_once __DIR__ . '/../models/User.php';

class AuthService
{
    private User $userModel;

    public function __construct(PDO $pdo)
    {
        $this->userModel = new User($pdo);
    }

    public function login(string $email, string $password): array
    {
        $email = trim($email);

        if ($email === '' || $password === '') {
            return [
                'success' => false,
                'message' => 'El correo y la contraseña son obligatorios.'
            ];
        }

        $user = $this->userModel->findByEmail($email);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Las credenciales son incorrectas.'
            ];
        }

        if ($user['status'] !== 'ACTIVE') {
            return [
                'success' => false,
                'message' => 'El usuario se encuentra inactivo.'
            ];
        }

        if ($user['role'] !== 'ADMIN') {
            return [
                'success' => false,
                'message' => 'No tienes permisos para acceder al panel administrativo.'
            ];
        }

        if (!password_verify($password, $user['password_hash'])) {
            return [
                'success' => false,
                'message' => 'Las credenciales son incorrectas.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Inicio de sesión exitoso.',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ];
    }
}