<?php
require_once __DIR__ . '/../../../../config/app.php';
require_once __DIR__ . '/../../../../components/admin-header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/orders/admin/css/orders.css">

<main class="admin-page">
    <section class="admin-page-header">
        <div class="admin-page-heading">
            <span class="admin-page-eyebrow">Ventas</span>
            <h1>Pedidos</h1>
            <p>Consulta y actualiza el estado de los pedidos de la tienda.</p>
        </div>
    </section>

    <section class="admin-filters">
        <div class="admin-filter-group">
            <label for="order-status-filter">Estado</label>
            <select id="order-status-filter">
                <option value="">Todos</option>
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregado</option>
                <option value="CANCELLED">Cancelado</option>
            </select>
        </div>

        <button type="button" class="admin-button admin-button-secondary" id="btn-clear-order-filter">
            Limpiar
        </button>
    </section>

    <div class="admin-table-wrapper">
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody id="orders-table-body">
                <tr>
                    <td colspan="6" class="admin-loading">Cargando pedidos...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div id="orders-message" class="admin-message" hidden></div>
</main>

<!-- Modal de detalle -->
<div class="admin-modal" id="order-modal" hidden>
    <div class="admin-modal-overlay" data-modal-close></div>

    <div class="admin-modal-dialog order-modal-dialog">
        <div class="admin-modal-header">
            <div>
                <span class="admin-page-eyebrow">Pedido</span>
                <h2 id="order-modal-title">Detalle del pedido</h2>
            </div>

            <button
                type="button"
                class="admin-modal-close"
                id="btn-close-order-modal"
                aria-label="Cerrar">
                ×
            </button>
        </div>

        <div id="order-detail-content">
            <p class="admin-loading">Cargando pedido...</p>
        </div>
    </div>
</div>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/modules/orders/admin/funcs/orders.js"></script>

<?php require_once __DIR__ . '/../../../../components/admin-footer.php'; ?>
