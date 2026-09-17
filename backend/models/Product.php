<?php

require_once __DIR__ . '/../config/Database.php';

class Product
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll(array $filters = [], bool $onlyActive = false, int $limit = 20, int $offset = 0): array
    {
        $sql = 'SELECT p.*, c.name AS category_name, i.stock,
                (SELECT image_path
                 FROM product_images pi
                 WHERE pi.product_id = p.id
                 ORDER BY pi.is_primary DESC, pi.id ASC
                 LIMIT 1) AS main_image
                FROM products p
                JOIN categories c ON c.id = p.category_id
                LEFT JOIN inventory i ON i.product_id = p.id
                WHERE 1=1
                AND p.deleted_at IS NULL';

        $params = [];

        if ($onlyActive) {
            $sql .= " AND p.status = 'ACTIVE'";
        }

        if (!empty($filters['category_id'])) {
            $sql .= ' AND p.category_id = :category_id';
            $params['category_id'] = $filters['category_id'];
        }

        if (!empty($filters['brand'])) {
            $sql .= ' AND p.brand = :brand';
            $params['brand'] = $filters['brand'];
        }

        if (!empty($filters['search'])) {
            $sql .= ' AND p.name LIKE :search';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $sql .= ' ORDER BY p.created_at DESC LIMIT :limit OFFSET :offset';

        $stmt = $this->db->prepare($sql);

        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function count(array $filters = [], bool $onlyActive = false): int
    {
        $sql = 'SELECT COUNT(*) AS total
                FROM products p
                WHERE 1=1
                AND p.deleted_at IS NULL';

        $params = [];

        if ($onlyActive) {
            $sql .= " AND p.status = 'ACTIVE'";
        }

        if (!empty($filters['category_id'])) {
            $sql .= ' AND p.category_id = :category_id';
            $params['category_id'] = $filters['category_id'];
        }

        if (!empty($filters['brand'])) {
            $sql .= ' AND p.brand = :brand';
            $params['brand'] = $filters['brand'];
        }

        if (!empty($filters['search'])) {
            $sql .= ' AND p.name LIKE :search';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return (int) $stmt->fetch()['total'];
    }

    public function getById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT p.*, c.name AS category_name, i.stock, i.minimum_stock,
                    (SELECT image_path
                     FROM product_images pi
                     WHERE pi.product_id = p.id
                     ORDER BY pi.is_primary DESC, pi.id ASC
                     LIMIT 1) AS main_image
             FROM products p
             JOIN categories c ON c.id = p.category_id
             LEFT JOIN inventory i ON i.product_id = p.id
             WHERE p.id = :id
             AND p.deleted_at IS NULL'
        );

        $stmt->execute(['id' => $id]);

        return $stmt->fetch() ?: null;
    }

    public function getByNameAndPrice(string $name, $price): array
    {
        $stmt = $this->db->prepare(
            'SELECT p.*,
                    pi.id AS image_id,
                    pi.image_path,
                    pi.is_primary
             FROM products p
             LEFT JOIN product_images pi
                ON pi.product_id = p.id
                AND pi.is_primary = 1
             WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(:name))
             AND p.price = :price
             ORDER BY p.id ASC'
        );

        $stmt->execute([
            'name' => $name,
            'price' => $price
        ]);

        return $stmt->fetchAll();
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO products
                (category_id, brand, name, description, price, color, status)
             VALUES
                (:category_id, :brand, :name, :description, :price, :color, :status)'
        );

        $stmt->execute([
            'category_id' => $data['category_id'],
            'brand' => $data['brand'] ?? null,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'color' => $data['color'] ?? null,
            'status' => $data['status'] ?? 'ACTIVE',
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE products
             SET category_id = :category_id,
                 brand = :brand,
                 name = :name,
                 description = :description,
                 price = :price,
                 color = :color,
                 status = :status
             WHERE id = :id'
        );

        return $stmt->execute([
            'category_id' => $data['category_id'],
            'brand' => $data['brand'] ?? null,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'color' => $data['color'] ?? null,
            'status' => $data['status'] ?? 'ACTIVE',
            'id' => $id
        ]);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM products WHERE id = :id'
        );

        return $stmt->execute(['id' => $id]);
    }

    public function getPrice(int $id): ?float
    {
        $stmt = $this->db->prepare(
            'SELECT price FROM products WHERE id = :id'
        );

        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch();

        return $row ? (float) $row['price'] : null;
    }

    public function softDelete(int $id): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE products SET deleted_at = NOW() WHERE id = :id'
        );

        return $stmt->execute(['id' => $id]);
    }
}
