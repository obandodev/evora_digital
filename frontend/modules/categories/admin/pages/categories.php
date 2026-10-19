<?php
require_once __DIR__ . '/../../../../config/app.php';
require_once __DIR__ . '/../../../../components/admin-header.php';
?>

<main class="admin-page">
    <section class="admin-page-header">
        <div class="admin-page-heading">
            <span class="admin-page-eyebrow">Catálogo</span>
            <h1>Categorías</h1>
            <p>Organiza las categorías del catálogo de Glam Beauty.</p>
        </div>

        <button
            type="button"
            class="admin-button admin-button-primary"
            id="btn-create-category">
            Nueva categoría
        </button>
    </section>

    <section class="admin-table-wrapper">
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody id="categories-table-body">
                <tr>
                    <td colspan="4" class="admin-loading">Cargando categorías...</td>
                </tr>
            </tbody>
        </table>
    </section>

    <div id="categories-message" class="admin-message" hidden></div>
</main>

<!-- Modal de creación / edición -->
<div class="admin-modal" id="category-modal" hidden>
    <div class="admin-modal-overlay" data-modal-close></div>

    <div class="admin-modal-dialog">
        <div class="admin-modal-header">
            <div>
                <span class="admin-page-eyebrow">Catálogo</span>
                <h2 id="category-modal-title">Nueva categoría</h2>
            </div>

            <button
                type="button"
                class="admin-modal-close"
                id="btn-close-category-modal"
                aria-label="Cerrar">
                ×
            </button>
        </div>

        <form id="category-form">
            <input type="hidden" id="category-id" name="id">

            <div class="admin-form-grid">
                <div class="admin-form-field admin-form-field-full">
                    <label for="category-name">Nombre</label>
                    <input
                        type="text"
                        id="category-name"
                        name="name"
                        required>
                </div>
                
                <div class="admin-form-field admin-form-field-full">
                    <label for="category-parent">Categoría padre</label>
                    <select id="category-parent" name="parent_id">
                        <option value="">Ninguna (categoría principal)</option>
                    </select>
                    <small id="category-parent-hint" hidden></small>
                </div>

                <div class="admin-form-field admin-form-field-full">
                    <label for="category-description">Descripción</label>
                    <textarea
                        id="category-description"
                        name="description"
                        rows="3"></textarea>
                </div>

                <div class="admin-form-field">
                    <label for="category-status">Estado</label>
                    <select id="category-status" name="status">
                        <option value="ACTIVE">Activa</option>
                        <option value="INACTIVE">Inactiva</option>
                    </select>
                </div>
            </div>

            <div class="admin-form-message admin-message" id="category-modal-message" hidden></div>

            <div class="admin-modal-actions">
                <button
                    type="button"
                    class="admin-button admin-button-secondary"
                    id="btn-cancel-category">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="admin-button admin-button-primary"
                    id="btn-save-category">
                    Guardar categoría
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Modal de confirmación -->
<div class="admin-confirm-modal" id="category-confirm-modal" hidden>
    <div class="admin-confirm-overlay" data-confirm-close></div>

    <div class="admin-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="category-confirm-title">
        <div class="admin-confirm-icon" id="category-confirm-icon">!</div>

        <div class="admin-confirm-content">
            <span class="admin-page-eyebrow" id="category-confirm-eyebrow">Confirmación</span>
            <h2 id="category-confirm-title">¿Estás seguro?</h2>
            <p id="category-confirm-message">Esta acción no se puede deshacer.</p>
        </div>

        <div class="admin-confirm-actions">
            <button type="button" class="admin-button admin-button-secondary" id="category-confirm-cancel">
                Cancelar
            </button>

            <button type="button" class="admin-button admin-confirm-submit" id="category-confirm-submit">
                Confirmar
            </button>
        </div>
    </div>
</div>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/modules/categories/admin/funcs/categories.js"></script>

<?php require_once __DIR__ . '/../../../../components/admin-footer.php'; ?>
