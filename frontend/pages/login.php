<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../components/header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/login.css">

<main class="login-page">
    <section class="login-container">
        <div class="login-intro">
            <span class="eyebrow">GLAM BEAUTY</span>
            <h1>Panel<br>administrativo.</h1>
            <p>
                Gestiona productos, categorías, inventario y pedidos
                desde un solo lugar.
            </p>
        </div>

        <form id="login-form" class="login-form">
            <div class="login-heading">
                <span>ACCESO ADMINISTRATIVO</span>
                <h2>Iniciar sesión</h2>
            </div>

            <div class="form-group">
                <label for="login-email">Correo electrónico</label>

                <input
                    type="email"
                    id="login-email"
                    name="email"
                    required
                    autocomplete="email"
                    placeholder="admin@glambeauty.com"
                >
            </div>

            <div class="form-group">
                <label for="login-password">Contraseña</label>

                <input
                    type="password"
                    id="login-password"
                    name="password"
                    required
                    autocomplete="current-password"
                    placeholder="••••••••"
                >
            </div>

            <div
                id="login-message"
                class="login-message"
                hidden
            ></div>

            <button
                type="submit"
                class="btn btn-primary login-button"
            >
                <span class="login-button-text">Ingresar</span>
                <span class= "login-button-spinner" aria-hidden="true"></span>
            </button>
        </form>
    </section>
</main>

<?php require_once __DIR__ . '/../components/footer.php'; ?>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/funcs/login.js"></script>