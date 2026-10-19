<?php require_once __DIR__ . '/../../../../../components/admin-header.php'; ?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/css/admin-dashboard.css">

<main class="admin-content">
    <section class="admin-page-header">
        <div>
            <span class="admin-eyebrow">RESUMEN</span>
            <h1>Dashboard</h1>
            <p>Vista general de la operación de E'vora Digital.</p>
        </div>
    </section>

<section class="admin-stat-grid">
    <article class="admin-stat">
        <span class="admin-stat-label">Productos</span>
        <strong id="stat-products">—</strong>
        <small>Productos registrados</small>
    </article>

    <article class="admin-stat">
        <span class="admin-stat-label">Categorías</span>
        <strong id="stat-categories">—</strong>
        <small>Categorías disponibles</small>
    </article>

    <article class="admin-stat">
        <span class="admin-stat-label">Pedidos</span>
        <strong id="stat-orders">—</strong>
        <small>Pedidos registrados</small>
    </article>

    <article class="admin-stat">
        <span class="admin-stat-label">Pendientes</span>
        <strong id="stat-pending">—</strong>
        <small>Pedidos pendientes</small>
    </article>
</section>

<section class="dashboard-grid">
    <article class="dashboard-panel">
        <div class="dashboard-panel-header">
            <div>
                <span class="admin-eyebrow">PEDIDOS</span>
                <h2>Pedidos recientes</h2>
            </div>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/orders/admin/pages/orders.php"
                class="dashboard-link"
            >
                Ver todos
            </a>
        </div>

        <div class="dashboard-orders" id="dashboard-orders">
            <p class="dashboard-empty">Cargando pedidos...</p>
        </div>
    </article>

    <article class="dashboard-panel">
        <div class="dashboard-panel-header">
            <div>
                <span class="admin-eyebrow">INVENTARIO</span>
                <h2>Accesos rápidos</h2>
            </div>
        </div>

        <div class="dashboard-actions">
            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/pages/product.php"
                class="dashboard-action"
            >
                <span>01</span>
                <div>
                    <strong>Gestionar productos</strong>
                    <small>Crear, editar y administrar productos.</small>
                </div>
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/categories/admin/pages/categories.php"
                class="dashboard-action"
            >
                <span>02</span>
                <div>
                    <strong>Gestionar categorías</strong>
                    <small>Organizar el catálogo de la tienda.</small>
                </div>
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/inventory/admin/pages/inventory.php"
                class="dashboard-action"
            >
                <span>03</span>
                <div>
                    <strong>Controlar inventario</strong>
                    <small>Registrar entradas y ajustes de stock.</small>
                </div>
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/modules/orders/admin/pages/orders.php"
                class="dashboard-action"
            >
                <span>04</span>
                <div>
                    <strong>Gestionar pedidos</strong>
                    <small>Consultar y actualizar pedidos.</small>
                </div>
            </a>
        </div>
    </article>
</section>

</main>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/funcs/admin-dashboard.js"></script>

<?php require_once __DIR__ . '/../../../../../components/admin-footer.php'; ?>
