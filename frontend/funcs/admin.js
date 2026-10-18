import { AuthAPI } from '../api/authApi.js';

const LOGIN_URL = `${window.GLAM.FRONTEND_URL}/pages/login.php`;

document.addEventListener('DOMContentLoaded', checkAdminSession);

async function checkAdminSession() {
    try {
        const response = await AuthAPI.me();
        const user = response.data;

        const nameEl = document.getElementById('admin-user-name');

        if (nameEl && user?.name) {
            nameEl.textContent = user.name;
        }
    } catch (error) {
        window.location.href = LOGIN_URL;
    }
}
