<?php
require_once __DIR__ . '/../config/app.php';
?>

<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <script>
        window.GLAM = <?= json_encode([
            'BASE_URL'     => GLAM_BASE_URL,
            'FRONTEND_URL' => GLAM_FRONTEND_URL,
            'API_URL'      => GLAM_API_URL,
            'IMAGE_URL'    => GLAM_IMAGE_URL,
        ], JSON_UNESCAPED_SLASHES) ?>;
    </script>

    <title>
        Glam Beauty — Administración
    </title>

    <link
        rel="stylesheet"
        href="<?= GLAM_FRONTEND_URL ?>/styles/global.css"
    >

    <link
        rel="stylesheet"
        href="<?= GLAM_FRONTEND_URL ?>/styles/admin.css"
    >

    <link
        rel="stylesheet"
        href="<?= GLAM_FRONTEND_URL ?>/styles/admin-shared.css"
    >

</head>

<body class="admin-body">

<div class="admin-layout">

    <aside
        class="admin-sidebar"
        id="admin-sidebar"
    >

        <a
            href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/pages/admin/dashboard.php"
            class="admin-brand"
        >

            <span class="brand-mark">
                G
            </span>

            <div>

                <strong>
                    E'vora Digital
                </strong>

                <span>
                    Administración
                </span>

            </div>

        </a>

        <nav class="admin-nav">

            <span class="admin-nav-label">
                GESTIÓN
            </span>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/pages/admin/dashboard.php"
                class="admin-nav-link"
            >
                <span>01</span>
                Dashboard
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/pages/product.php"
                class="admin-nav-link"
            >
                <span>02</span>
                Productos
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/categories/admin/pages/categories.php"
                class="admin-nav-link"
            >
                <span>03</span>
                Categorías
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/inventory/admin/pages/inventory.php"
                class="admin-nav-link"
            >
                <span>04</span>
                Inventario
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/orders/admin/pages/orders.php"
                class="admin-nav-link"
            >
                <span>05</span>
                Pedidos
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/reports/admin/pages/reports.php"
                class="admin-nav-link"
            >
                <span>06</span>
                Reportes
            </a>

        </nav>

        <div class="admin-sidebar-bottom">

            <a
                href="<?= GLAM_FRONTEND_URL ?>/pages/home.php"
                class="admin-exit-link"
            >
                Ver tienda
            </a>

            <button
                type="button"
                id="admin-logout"
                class="admin-logout"
            >
                Cerrar sesión
            </button>

        </div>

    </aside>

    <div
        class="admin-sidebar-overlay"
        id="admin-sidebar-overlay"
        hidden
    ></div>

    <div class="admin-main">

        <header class="admin-topbar">

            <div class="admin-topbar-left">

                <button
                    type="button"
                    id="admin-menu-toggle"
                    class="admin-menu-toggle"
                    aria-label="Abrir menú"
                    aria-expanded="false"
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>

                <div>

                    <span class="admin-topbar-label">
                        GLAM BEAUTY
                    </span>

                    <strong>
                        Panel administrativo
                    </strong>

                </div>

            </div>

            <div class="admin-user">

                <span id="admin-user-name">
                    Administrador
                </span>

            </div>

        </header>