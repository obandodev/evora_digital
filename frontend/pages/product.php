<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../components/header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/product.css">

<main class="product-page">
    <div id="product-detail" class="product-detail">
        <p class="loading-message">Cargando producto...</p>
    </div>
</main>

<?php require_once __DIR__ . '/../components/footer.php'; ?>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/funcs/product.js"></script>
