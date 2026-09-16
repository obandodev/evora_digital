import { AuthAPI } from '../api/authApi.js';

const LOGIN_URL = '/glam-beauty/frontend/pages/login.php';

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
