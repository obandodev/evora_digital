<?php
require_once __DIR__ . '/../../../../config/app.php';
require_once __DIR__ . '/../../../../components/admin-header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/inventory/admin/css/inventory.css">

<main class="admin-page">
    <section class="admin-page-header">
        <div class="admin-page-heading">
            <span class="admin-page-eyebrow">Operación</span>
            <h1>Inventario</h1>
            <p>Consulta el stock actual y registra entradas o ajustes.</p>
        </div>

        <button
            type="button"
            class="admin-button admin-button-primary"
            id="btn-open-adjust">
            Registrar movimiento
        </button>
    </section>

    <section class="admin-filters">
        <div class="admin-filter-group">
            <label for="inventory-product-filter">Filtrar por producto</label>
            <select id="inventory-product-filter">
                <option value="">Todos los productos</option>
            </select>
        </div>

        <button type="button" class="admin-button admin-button-secondary" id="btn-clear-inventory-filter">
            Limpiar
        </button>
    </section>

    <section class="inventory-section">
        <h2 class="inventory-section-title">Stock actual</h2>

        <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Marca</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody id="stock-table-body">
                    <tr>
                        <td colspan="5" class="admin-loading">Cargando stock...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <section class="inventory-section">
        <h2 class="inventory-section-title">Historial de movimientos</h2>

        <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Stock anterior</th>
                        <th>Stock nuevo</th>
                        <th>Usuario</th>
                        <th>Descripción</th>
                    </tr>
                </thead>

                <tbody id="movements-table-body">
                    <tr>
                        <td colspan="8" class="admin-loading">Cargando movimientos...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <div id="inventory-message" class="admin-message" hidden></div>
</main>

<!-- Modal de ajuste -->
<div class="admin-modal" id="inventory-modal" hidden>
    <div class="admin-modal-overlay" data-modal-close></div>

    <div class="admin-modal-dialog">
        <div class="admin-modal-header">
            <div>
                <span class="admin-page-eyebrow">Inventario</span>
                <h2>Registrar movimiento</h2>
            </div>

            <button
                type="button"
                class="admin-modal-close"
                id="btn-close-inventory-modal"
                aria-label="Cerrar">
                ×
            </button>
        </div>

        <form id="inventory-form">
            <div class="admin-form-grid">
                <div class="admin-form-field admin-form-field-full">
                    <label for="inventory-product">Producto</label>
                    <select id="inventory-product" name="product_id" required>
                        <option value="">Seleccionar producto</option>
                    </select>
                </div>

                <div class="admin-form-field">
                    <label for="inventory-type">Tipo de movimiento</label>
                    <select id="inventory-type" name="movement_type">
                        <option value="ENTRY">Entrada</option>
                        <option value="ADJUSTMENT">Ajuste</option>
                    </select>
                </div>

                <div class="admin-form-field">
                    <label for="inventory-quantity">Cantidad a agregar</label>
                    <input
                        type="number"
                        id="inventory-quantity"
                        name="quantity"
                        min="1"
                        required>
                </div>

                <div class="admin-form-field admin-form-field-full">
                    <label for="inventory-description">Descripción</label>
                    <textarea
                        id="inventory-description"
                        name="description"
                        rows="3"
                        placeholder="Ej. Compra a proveedor, corrección de conteo físico..."></textarea>
                </div>
            </div>

            <p class="inventory-form-hint">
                Este movimiento suma la cantidad indicada al stock actual del producto.
            </p>

            <div class="admin-form-message admin-message" id="inventory-modal-message" hidden></div>

            <div class="admin-modal-actions">
                <button
                    type="button"
                    class="admin-button admin-button-secondary"
                    id="btn-cancel-inventory">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="admin-button admin-button-primary"
                    id="btn-save-inventory">
                    Registrar
                </button>
            </div>
        </form>
    </div>
</div>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/modules/inventory/admin/funcs/inventory.js"></script>

<?php require_once __DIR__ . '/../../../../components/admin-footer.php'; ?>
