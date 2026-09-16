import { AuthAPI } from '../api/authApi.js';

document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    document
        .getElementById('login-form')
        ?.addEventListener('submit', handleLogin);
});

async function checkSession() {
    try {
        await AuthAPI.me();
        window.location.href = '/glam-beauty/frontend/modules/products/admin/pages/admin/dashboard.php';
    } catch {
        // No hay sesión activa.
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('.login-button');
    const message = document.getElementById('login-message');

    const email = document
        .getElementById('login-email')
        .value
        .trim();

    const password = document
        .getElementById('login-password')
        .value;

    message.hidden = true;
    message.textContent = '';

    button.disabled = true;
    button.textContent = 'Ingresando...';

    try {
        await AuthAPI.login(email, password);

        window.location.href = '/glam-beauty/frontend/modules/products/admin/pages/admin/dashboard.php';
    } catch (error) {
        message.hidden = false;
        message.className = 'login-message error';
        message.textContent = error.message || 'Credenciales incorrectas.';

        button.disabled = false;
        button.textContent = 'Ingresar';
    }
}