<?php
require_once __DIR__ . '/../config/Database.php';

class ProductImage
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getByProduct(int $productId): array
    {
        $stmt = $this->db->prepare(
            'SELECT id, image_path, is_primary FROM product_images
             WHERE product_id = :product_id ORDER BY is_primary DESC, id ASC'
        );
        $stmt->execute(['product_id' => $productId]);
        return $stmt->fetchAll();
    }

    public function countByProduct(int $productId): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) AS total FROM product_images WHERE product_id = :product_id');
        $stmt->execute(['product_id' => $productId]);
        return (int) $stmt->fetch()['total'];
    }

    public function add(int $productId, string $imagePath, bool $isPrimary = false): int
    {
        if ($isPrimary) {
            $this->clearPrimary($productId);
        }

        $stmt = $this->db->prepare(
            'INSERT INTO product_images (product_id, image_path, is_primary)
             VALUES (:product_id, :image_path, :is_primary)'
        );
        $stmt->execute([
            'product_id' => $productId,
            'image_path' => $imagePath,
            'is_primary' => $isPrimary ? 1 : 0,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function clearPrimary(int $productId): void
    {
        $stmt = $this->db->prepare('UPDATE product_images SET is_primary = 0 WHERE product_id = :product_id');
        $stmt->execute(['product_id' => $productId]);
    }

    public function delete(int $imageId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM product_images WHERE id = :id');
        return $stmt->execute(['id' => $imageId]);
    }

    public function getById(int $imageId): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM product_images WHERE id = :id');
        $stmt->execute(['id' => $imageId]);
        return $stmt->fetch() ?: null;
    }
}
