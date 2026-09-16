<?php
require_once __DIR__ . '/../../../../config/app.php';
require_once __DIR__ . '/../../../../components/admin-header.php';
?>

<link rel="stylesheet" href="../css/reports.css">

<main class="admin-content reports-page">
    <?php require __DIR__ . '/../components/reports-header.php'; ?>
    <?php require __DIR__ . '/../components/reports-filter.php'; ?>
    <?php require __DIR__ . '/../components/reports-summary.php'; ?>
    <?php require __DIR__ . '/../components/reports-inventory-category.php'; ?>
    <?php require __DIR__ . '/../components/reports-inventory-products.php'; ?>
    <?php require __DIR__ . '/../components/reports-sales-category.php'; ?>
    <?php require __DIR__ . '/../components/reports-sales-products.php'; ?>
</main>

<script type="module" src="../funcs/reports.js"></script>

<?php require_once __DIR__ . '/../../../../components/admin-footer.php'; ?>