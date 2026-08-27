<?php

class User
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findByEmail(string $email): ?array
    {
        $sql = "
            SELECT
                id,
                name,
                email,
                password_hash,
                role,
                status,
                created_at,
                updated_at
            FROM users
            WHERE email = :email
            LIMIT 1
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':email' => $email
        ]);

        $user = $stmt->fetch();

        return $user ?: null;
    }

    public function create(
        string $name,
        string $email,
        string $passwordHash
    ): int {
        $sql = "
            INSERT INTO users (
                name,
                email,
                password_hash,
                role,
                status
            )
            VALUES (
                :name,
                :email,
                :password_hash,
                'ADMIN',
                'ACTIVE'
            )
        ";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':password_hash' => $passwordHash
        ]);

        return (int) $this->pdo->lastInsertId();
    }
}