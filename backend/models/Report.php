<?php
require_once __DIR__ . '/../config/Database.php';

class Report
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getSummary(?string $from = null, ?string $to = null): array
    {
        $dateParams = $this->buildDateFilter('o.created_at', $from, $to);

        $salesSql = "SELECT
                COALESCE(SUM(o.total), 0) AS total_sales,
                COUNT(o.id) AS delivered_orders
             FROM orders o
             WHERE o.status = 'DELIVERED'" . $dateParams['sql'];

        $stmt = $this->db->prepare($salesSql);
        $stmt->execute($dateParams['params']);
        $sales = $stmt->fetch() ?: [];

        $inventoryStmt = $this->db->query(
            "SELECT
                COUNT(p.id) AS total_products,
                COALESCE(SUM(COALESCE(i.stock, 0)), 0) AS total_units,
                COALESCE(SUM(COALESCE(i.stock, 0) * p.price), 0) AS inventory_value,
                COALESCE(SUM(
                    CASE
                        WHEN COALESCE(i.stock, 0) = 0 THEN 1
                        ELSE 0
                    END
                ), 0) AS out_of_stock,
                COALESCE(SUM(
                    CASE
                        WHEN COALESCE(i.stock, 0) > 0
                        AND COALESCE(i.stock, 0) <= COALESCE(i.minimum_stock, 5)
                        THEN 1
                        ELSE 0
                    END
                ), 0) AS low_stock
             FROM products p
             LEFT JOIN inventory i ON i.product_id = p.id
             WHERE p.status = 'ACTIVE'"
        );

        $inventory = $inventoryStmt->fetch() ?: [];

        $totalSales = (float) ($sales['total_sales'] ?? 0);
        $deliveredOrders = (int) ($sales['delivered_orders'] ?? 0);

        return [
            'sales' => [
                'total_sales' => $totalSales,
                'delivered_orders' => $deliveredOrders,
                'average_order' => $deliveredOrders > 0
                    ? round($totalSales / $deliveredOrders, 2)
                    : 0,
            ],
            'inventory' => [
                'total_products' => (int) ($inventory['total_products'] ?? 0),
                'total_units' => (int) ($inventory['total_units'] ?? 0),
                'inventory_value' => (float) ($inventory['inventory_value'] ?? 0),
                'out_of_stock' => (int) ($inventory['out_of_stock'] ?? 0),
                'low_stock' => (int) ($inventory['low_stock'] ?? 0),
            ],
        ];
    }

    public function getInventoryByCategory(): array
    {
        $stmt = $this->db->query(
            "SELECT
                c.id,
                c.name AS category_name,
                COUNT(p.id) AS total_products,
                COALESCE(SUM(COALESCE(i.stock, 0)), 0) AS total_units,
                COALESCE(SUM(COALESCE(i.stock, 0) * p.price), 0) AS inventory_value
             FROM categories c
             LEFT JOIN products p
                ON p.category_id = c.id
                AND p.status = 'ACTIVE'
             LEFT JOIN inventory i
                ON i.product_id = p.id
             WHERE c.status = 'ACTIVE'
             GROUP BY c.id, c.name
             ORDER BY inventory_value DESC, c.name ASC"
        );

        return $stmt->fetchAll();
    }

    public function getInventoryProducts(): array
    {
        $stmt = $this->db->query(
            "SELECT
                p.id,
                p.name AS product_name,
                p.brand,
                c.name AS category_name,
                p.price,
                COALESCE(i.stock, 0) AS stock,
                COALESCE(i.minimum_stock, 5) AS minimum_stock,
                COALESCE(i.stock, 0) * p.price AS inventory_value,
                CASE
                    WHEN COALESCE(i.stock, 0) = 0 THEN 'OUT_OF_STOCK'
                    WHEN COALESCE(i.stock, 0) <= COALESCE(i.minimum_stock, 5) THEN 'LOW'
                    ELSE 'AVAILABLE'
                END AS stock_status
             FROM products p
             INNER JOIN categories c ON c.id = p.category_id
             LEFT JOIN inventory i ON i.product_id = p.id
             WHERE p.status = 'ACTIVE'
             ORDER BY inventory_value DESC, p.name ASC"
        );

        return $stmt->fetchAll();
    }

    public function getSalesByCategory(?string $from = null, ?string $to = null): array
    {
        $dateParams = $this->buildDateFilter('o.created_at', $from, $to);

        $sql = "SELECT
                    c.id,
                    c.name AS category_name,
                    COALESCE(SUM(od.quantity), 0) AS units_sold,
                    COALESCE(SUM(od.subtotal), 0) AS sales_value
                FROM orders o
                INNER JOIN order_details od
                    ON od.order_id = o.id
                INNER JOIN products p
                    ON p.id = od.product_id
                INNER JOIN categories c
                    ON c.id = p.category_id
                WHERE o.status = 'DELIVERED'"
                . $dateParams['sql'] .
                " GROUP BY c.id, c.name
                  ORDER BY sales_value DESC, c.name ASC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($dateParams['params']);

        return $stmt->fetchAll();
    }

    public function getSalesByProduct(?string $from = null, ?string $to = null): array
    {
        $dateParams = $this->buildDateFilter('o.created_at', $from, $to);

        $sql = "SELECT
                    p.id,
                    p.name AS product_name,
                    p.brand,
                    c.name AS category_name,
                    COALESCE(SUM(od.quantity), 0) AS units_sold,
                    COALESCE(SUM(od.subtotal), 0) AS sales_value
                FROM orders o
                INNER JOIN order_details od
                    ON od.order_id = o.id
                INNER JOIN products p
                    ON p.id = od.product_id
                INNER JOIN categories c
                    ON c.id = p.category_id
                WHERE o.status = 'DELIVERED'"
                . $dateParams['sql'] .
                " GROUP BY p.id, p.name, p.brand, c.name
                  ORDER BY units_sold DESC, sales_value DESC, p.name ASC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($dateParams['params']);

        return $stmt->fetchAll();
    }

    private function buildDateFilter(
        string $column,
        ?string $from,
        ?string $to
    ): array {
        $sql = '';
        $params = [];

        if ($from !== null && $from !== '') {
            $sql .= " AND $column >= :date_from";
            $params['date_from'] = $from . ' 00:00:00';
        }

        if ($to !== null && $to !== '') {
            $sql .= " AND $column <= :date_to";
            $params['date_to'] = $to . ' 23:59:59';
        }

        return [
            'sql' => $sql,
            'params' => $params,
        ];
    }
}