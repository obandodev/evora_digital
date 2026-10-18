-- =========================================================
-- E'vora Digital
-- Base de datos para tienda virtual de productos de maquillaje
-- PHP + MySQL/MariaDB
-- =========================================================

CREATE DATABASE IF NOT EXISTS evora_digital
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE evora_digital;

-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'SELLER', 'WAREHOUSE') NOT NULL DEFAULT 'ADMIN',
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- 2. CATEGORIES (categorías y subcategorías, 2 niveles)
--    parent_id NULL  -> categoría principal (ej. Maquillaje)
--    parent_id = X   -> subcategoría de X (ej. Labios)
-- =========================================================

CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id INT UNSIGNED NULL,
    -- Columna calculada: permite que el nombre sea único por padre,
    -- incluso entre categorías principales (donde parent_id es NULL).
    parent_key INT UNSIGNED GENERATED ALWAYS AS (IFNULL(parent_id, 0)) STORED,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id)
        REFERENCES categories(id)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,

    UNIQUE KEY uk_categories_parent_name (parent_key, name),
    INDEX idx_categories_parent (parent_id)
) ENGINE=InnoDB;

-- =========================================================
-- 3. PRODUCTS
-- =========================================================

CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id INT UNSIGNED NOT NULL,
    brand VARCHAR(100) NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    price DECIMAL(12,2) NOT NULL,
    color VARCHAR(100) NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    INDEX idx_products_category (category_id),
    INDEX idx_products_brand (brand),
    INDEX idx_products_status (status),
    INDEX idx_products_name (name),
    INDEX idx_products_deleted_at (deleted_at)
) ENGINE=InnoDB;

-- =========================================================
-- 4. PRODUCT_IMAGES
-- =========================================================

CREATE TABLE product_images (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    INDEX idx_product_images_product (product_id)
) ENGINE=InnoDB;

-- =========================================================
-- 5. INVENTORY
-- =========================================================

CREATE TABLE inventory (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    minimum_stock INT UNSIGNED NOT NULL DEFAULT 5,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_product FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    UNIQUE KEY uk_inventory_product (product_id)
) ENGINE=InnoDB;

-- =========================================================
-- 6. ORDERS
-- =========================================================

CREATE TABLE orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(20) NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_email VARCHAR(150) NULL,
    delivery_address VARCHAR(255) NOT NULL,
    delivery_city VARCHAR(100) NULL,
    status ENUM(
        'PENDING',
        'CONFIRMED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    shipping_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_orders_code (order_code),
    INDEX idx_orders_status (status),
    INDEX idx_orders_date (created_at),
    INDEX idx_orders_customer (customer_name)
) ENGINE=InnoDB;

-- =========================================================
-- 7. INVENTORY_MOVEMENTS
-- =========================================================

CREATE TABLE inventory_movements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NULL,
    order_id INT UNSIGNED NULL,
    movement_type ENUM(
        'ENTRY',
        'EXIT',
        'ADJUSTMENT'
    ) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    previous_stock INT UNSIGNED NOT NULL,
    new_stock INT UNSIGNED NOT NULL,
    description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventory_movements_product FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_movements_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_inventory_movements_order FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    INDEX idx_inventory_movements_product (product_id),
    INDEX idx_inventory_movements_user (user_id),
    INDEX idx_inventory_movements_order (order_id),
    INDEX idx_inventory_movements_type (movement_type),
    INDEX idx_inventory_movements_date (created_at)
) ENGINE=InnoDB;

-- =========================================================
-- 8. ORDER_DETAILS
-- =========================================================

CREATE TABLE order_details (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,

    CONSTRAINT fk_order_details_order FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_order_details_product FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    INDEX idx_order_details_order (order_id),
    INDEX idx_order_details_product (product_id)
) ENGINE=InnoDB;