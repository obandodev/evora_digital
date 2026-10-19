<?php
// Script de un solo uso: crea el primer usuario administrador.
// Ejecútalo desde el navegador (http://localhost/glam-beauty/backend/seed_admin.php)
// UNA SOLA VEZ y luego BÓRRALO o renómbralo por seguridad.

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/Database.php';

$name = 'Admin';
$email = 'lauchiob@gmail.com';
$password = 'Evora-laura08'; // CAMBIA esta contraseña después del primer login

$db = Database::getConnection();

$check = $db->prepare('SELECT id FROM users WHERE email = :email');
$check->execute(['email' => $email]);

if ($check->fetch()) {
    die('Ya existe un usuario con ese email.');
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare(
    'INSERT INTO users (name, email, password_hash, role, status)
     VALUES (:name, :email, :password_hash, :role, :status)'
);
$stmt->execute([
    'name'          => $name,
    'email'         => $email,
    'password_hash' => $hash,
    'role'          => 'ADMIN',
    'status'        => 'ACTIVE',
]);

echo "Usuario admin creado correctamente.<br>";
echo "Email: $email<br>";
echo "Password: $password<br>";
echo "<strong>Borra este archivo ahora.</strong>";
