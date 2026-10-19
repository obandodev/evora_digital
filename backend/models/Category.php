<?php
require_once __DIR__ . '/../config/Database.php';

class Category
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Devuelve categorías y subcategorías ordenadas:
     * cada categoría principal seguida de sus subcategorías.
     */
    public function getAll(bool $onlyActive = false): array
    {
        $sql = 'SELECT c.id, c.parent_id, p.name AS parent_name,
                       c.name, c.description, c.status, c.created_at
                FROM categories c
                LEFT JOIN categories p ON p.id = c.parent_id';

        if ($onlyActive) {
            $sql .= " WHERE c.status = 'ACTIVE'
                      AND (p.id IS NULL OR p.status = 'ACTIVE')";
        }

        $sql .= ' ORDER BY COALESCE(p.name, c.name) ASC,
                           (c.parent_id IS NOT NULL) ASC,
                           c.name ASC';

        return $this->db->query($sql)->fetchAll();
    }

    public function getById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, parent_id, name, description, status, created_at
             FROM categories
             WHERE id = :id'
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function hasChildren(int $id): bool
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) AS total FROM categories WHERE parent_id = :id'
        );
        $stmt->execute(['id' => $id]);
        return (int) $stmt->fetch()['total'] > 0;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO categories (parent_id, name, description, status)
             VALUES (:parent_id, :name, :description, :status)'
        );
        $stmt->execute([
            'parent_id'   => $data['parent_id'] ?? null,
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'status'      => $data['status'] ?? 'ACTIVE',
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE categories
             SET parent_id = :parent_id,
                 name = :name,
                 description = :description,
                 status = :status
             WHERE id = :id'
        );
        return $stmt->execute([
            'parent_id'   => $data['parent_id'] ?? null,
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'status'      => $data['status'] ?? 'ACTIVE',
            'id'          => $id,
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM categories WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }
}