<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../components/header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/cart.css">

<main class="cart-page">
    <section class="cart-header">
        <span class="eyebrow">GLAM BEAUTY</span>
        <h1>Tu carrito de compras</h1>
        <p>Revisa tus productos antes de continuar.</p>
    </section>

    <section class="cart-content">
        <div id="cart-container">
            <p class="loading-message">Cargando carrito...</p>
        </div>
    </section>
</main>

<?php require_once __DIR__ . '/../components/footer.php'; ?>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/funcs/cart-page.js"></script>