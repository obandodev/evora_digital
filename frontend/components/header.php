<?php
require_once __DIR__ . '/../config/app.php';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glam Beauty</title>

    <link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/global.css">
    <link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/header.css">
    <link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/footer.css">
</head>

<body>

<header class="site-header">
    <div class="header-inner">

        <a
            href="<?= GLAM_FRONTEND_URL ?>/pages/home.php"
            class="brand"
        >
            <span class="brand-mark">G</span>
            <span class="brand-name">Glam Beauty</span>
        </a>

        <nav class="main-nav">
            <a href="<?= GLAM_FRONTEND_URL ?>/pages/home.php">
                Inicio
            </a>

            <a href="<?= GLAM_FRONTEND_URL ?>/pages/catalog.php">
                Catálogo
            </a>
        </nav>

        <div class="header-actions">
            <a href="<?= GLAM_FRONTEND_URL ?>/pages/login.php">
                Admin
            </a>

            <a
                href="<?= GLAM_FRONTEND_URL ?>/pages/cart.php"
                class="cart-link"
            >
                Carrito
                <span id="cart-count">0</span>
            </a>
        </div>

        <button
            type="button"
            class="menu-toggle"
            id="menu-toggle"
            aria-label="Abrir menú"
            aria-expanded="false"
        >
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>

    <div
        class="mobile-menu"
        id="mobile-menu"
        aria-hidden="true"
    >
        <div class="mobile-menu-header">
            <span>MENÚ</span>

            <button
                type="button"
                id="mobile-menu-close"
                class="mobile-menu-close"
                aria-label="Cerrar menú"
            >
                ×
            </button>
        </div>

        <nav class="mobile-nav">
            <a href="<?= GLAM_FRONTEND_URL ?>/pages/home.php">
                <span>01</span>
                Inicio
            </a>

            <a href="<?= GLAM_FRONTEND_URL ?>/pages/catalog.php">
                <span>02</span>
                Catálogo
            </a>

            <a href="<?= GLAM_FRONTEND_URL ?>/pages/login.php">
                <span>03</span>
                Administración
            </a>

            <a href="<?= GLAM_FRONTEND_URL ?>/pages/cart.php">
                <span>04</span>
                Carrito
                <span class="mobile-cart-count" id="mobile-cart-count">0</span>
            </a>
        </nav>

        <div class="mobile-menu-footer">
            <span>GLAM BEAUTY</span>
            <span>Belleza que habla por ti.</span>
        </div>
    </div>

    <div
        class="mobile-menu-overlay"
        id="mobile-menu-overlay"
        hidden
    ></div>
</header>

<div
    class="stock-modal"
    id="stock-modal"
    hidden
>
    <div
        class="stock-modal-overlay"
        data-close-stock-modal
    ></div>

    <div
        class="stock-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-modal-title"
    >
        <button
            type="button"
            class="stock-modal-close"
            data-close-stock-modal
            aria-label="Cerrar"
        >
            ×
        </button>

        <div class="stock-modal-icon">
            !
        </div>

        <span class="stock-modal-eyebrow">
            GLAM BEAUTY
        </span>

        <h2 id="stock-modal-title">
            Cantidad no disponible
        </h2>

        <p id="stock-modal-message">
            La cantidad seleccionada supera las unidades disponibles.
        </p>

        <div class="stock-modal-stock">
            <span>Disponibles</span>
            <strong id="stock-modal-available">0</strong>
        </div>

        <button
            type="button"
            class="stock-modal-button"
            data-close-stock-modal
        >
            Entendido
        </button>
    </div>
</div>