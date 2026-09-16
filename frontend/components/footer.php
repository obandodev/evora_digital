<?php
require_once __DIR__ . '/../config/app.php';
?>

<footer class="site-footer">
    <div class="footer-brand">
        <strong>Glam Beauty</strong>
        <span>Belleza que habla por ti.</span>
    </div>

    <span class="footer-copy">
        © <?= date('Y') ?> Glam Beauty
    </span>
</footer>

<script type="module">
    import { updateCartCount } from '<?= GLAM_FRONTEND_URL ?>/funcs/cart.js';

    updateCartCount();
</script>