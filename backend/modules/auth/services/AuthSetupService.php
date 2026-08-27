<?php
require_once __DIR__ . '/../models/User.php';

class AuthSetupService
{
    private User $userModel;
    private string $defaultName = 'Administrador';
    private string $defaultEmail = 'admin@glambeauty.com';
    private string $defaultPassword = 'Admin123*';

    public function __construct(PDO $pdo)
    {
        $this->userModel = new User($pdo);
    }

    public function ensureAdminExists(): void
    {
        $admin = $this->userModel->findByEmail(
            $this->defaultEmail
        );
        if ($admin) {
            return;
        }
        $passwordHash = password_hash(
            $this->defaultPassword,
            PASSWORD_DEFAULT
        );
        $this->userModel->create(
            $this->defaultName,
            $this->defaultEmail,
            $passwordHash
        );
    }
}