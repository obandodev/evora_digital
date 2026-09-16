<?php
require_once __DIR__ . '/../../../../config/app.php';
require_once __DIR__ . '/../../../../components/admin-header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/css/product.css">
<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/css/product-filters.css">
<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/css/product-summary.css">
<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/css/product-table.css">
<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/css/product-form.css">
<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/css/product-confirm-modal.css">

<main class="admin-page products-page">
    <section class="admin-page-header">
        <div class="products-page-heading">
            <span class="admin-page-eyebrow">Catálogo</span>
            <h1>Productos</h1>
            <p>Administra los productos disponibles en Glam Beauty.</p>
        </div>

        <button
            type="button"
            class="admin-button admin-button-primary products-create-button"
            id="btn-create-product">
            Nuevo producto
        </button>
    </section>

    <section class="products-filters-section">
        <?php require_once __DIR__ . '/../components/ProductFilters.php'; ?>
    </section>

    <?php require_once __DIR__ . '/../components/ProductSummary.php'; ?>

    <section class="products-table-section">
        <?php require_once __DIR__ . '/../components/ProductTable.php'; ?>
    </section>

    <?php require_once __DIR__ . '/../components/ProductForm.php'; ?>

    <?php require_once __DIR__ . '/../components/ProductConfirmModal.php'; ?>

    <div id="products-message" class="admin-message" hidden></div>
</main>

<script
    type="module"
    src="<?= GLAM_FRONTEND_URL ?>/modules/products/admin/funcs/admin.js">
</script>

<?php require_once __DIR__ . '/../../../../components/admin-footer.php'; ?>