<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../components/header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/home.css">

<main class="home-page">
    <section class="hero">
        <div class="hero-content">
            <span class="eyebrow">GLAM BEAUTY</span>
            <h1>Belleza que<br><em>habla por ti.</em></h1>
            <p>Descubre maquillaje seleccionado para resaltar tu estilo, experimentar con el color y hacer de cada look algo completamente tuyo.</p>
            <div class="hero-actions">
                <a href="catalog.php" class="btn btn-primary">Explorar catálogo</a>
                <a href="#featured" class="hero-text-link">Ver favoritos <span>↓</span></a>
            </div>
        </div>

        <div class="hero-visual">
            <div class="hero-circle hero-circle-large"></div>
            <div class="hero-circle hero-circle-small"></div>
            <div class="hero-label hero-label-top">BEAUTY / MAKEUP</div>
            <div class="hero-product">
                <div class="hero-product-shadow"></div>
                <div class="hero-product-box">
                    <span>GLAM</span>
                    <strong>BEAUTY</strong>
                    <small>MAKEUP COLLECTION</small>
                </div>
            </div>
            <div class="hero-label hero-label-bottom">EST. 2026</div>
        </div>
    </section>

    <section class="featured-section" id="featured">
        <div class="section-heading">
            <div>
                <span class="eyebrow">SELECCIÓN GLAM</span>
                <h2>Favoritos de la tienda</h2>
            </div>
            <a href="catalog.php" class="text-link">Ver catálogo <span>→</span></a>
        </div>

        <div id="featured-products" class="featured-products">
            <p class="loading-message">Cargando productos...</p>
        </div>
    </section>

    <section class="brand-section">
        <div class="brand-section-number"></div>
        <div class="brand-section-main">
            <span class="eyebrow">TU ESTILO</span>
            <h2>Encuentra productos<br>que se sientan <em>como tú.</em></h2>
        </div>

        <div class="brand-section-copy">
            <p>Maquillaje, color y detalles pensados para acompañar cada versión de ti.</p>
            <a href="catalog.php" class="brand-link">Descubrir colección <span>→</span></a>
        </div>
    </section>
</main>

<?php require_once __DIR__ . '/../components/footer.php'; ?>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/funcs/home.js"></script>
