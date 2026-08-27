<?php
session_start();

// Importar inicializador
require_once __DIR__ . '/../setup/authSetup.php';

if (isset($_SESSION['admin'])) {
    // Temporalmente desactivado mientras construimos el dashboard.
    /*
    header('Location: ../../../admin/pages/dashboard.php');
    exit;
    */
}
require_once __DIR__ . '/../components/LoginBrand.php';
require_once __DIR__ . '/../components/LoginForm.php';
require_once __DIR__ . '/../components/AuthModal.php';
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión | Glam Beauty</title>
    <link rel="stylesheet" href="../styles/login.css">
    <link rel="stylesheet" href="../styles/login-brand.css">
    <link rel="stylesheet" href="../styles/login-form.css">
    <link rel="stylesheet" href="../styles/auth-modal.css">
</head>

<body>
    <main class="login-page">
        <section class="login-visual">
            <?php renderLoginBrand(); ?>
        </section>
        <section class="login-section">
            <?php renderLoginForm(); ?>
        </section>
    </main>
    <?php renderAuthModal(); ?>
    <script type="module" src="../funcs/login.js"></script>
</body>

</html>