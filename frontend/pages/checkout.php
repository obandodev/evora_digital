<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../components/header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/checkout.css">

<main class="checkout-page">
    <section class="checkout-header">
        <span class="eyebrow">GLAM BEAUTY</span>
        <h1>Finalizar pedido</h1>
        <p>Completa tus datos para realizar tu pedido.</p>
    </section>

    <section class="checkout-content">
        <div id="checkout-container">
            <p class="loading-message">Cargando pedido...</p>
        </div>
    </section>
</main>

<!-- Modal de confirmación de pedido -->
<div class="order-modal" id="order-success-modal" hidden>
    <div class="order-modal-overlay"></div>

    <div class="order-modal-dialog">
        <span class="order-modal-icon">✓</span>

        <span class="eyebrow">PEDIDO RECIBIDO</span>

        <h2>¡Gracias por tu compra!</h2>

        <p>
            Tu pedido quedó registrado correctamente.
            Nos pondremos en contacto contigo por
            <strong>WhatsApp</strong> o <strong>correo electrónico</strong>
            para confirmar los detalles y completar el proceso de compra.
        </p>

        <div class="order-modal-code" id="order-modal-code" hidden>
            <span>Número de pedido</span>
            <strong id="order-modal-code-value"></strong>
        </div>

        <a href="catalog.php" class="btn btn-primary">Seguir comprando</a>
    </div>
</div>

<?php require_once __DIR__ . '/../components/footer.php'; ?>



<script type="module" src="<?= GLAM_FRONTEND_URL ?>/funcs/checkout.js"></script>