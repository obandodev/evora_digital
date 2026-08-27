import { loginAdmin } from "../api/authApi.js";
import { showAuthModal } from "./authModal.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const togglePassword = document.getElementById("togglePassword");

// MOSTRAR / OCULTAR CONTRASEÑA
togglePassword.addEventListener("click", () => {
    const passwordVisible = passwordInput.type === "text";

    passwordInput.type = passwordVisible ? "password" : "text";
    togglePassword.textContent = passwordVisible ? "Mostrar" : "Ocultar";
    togglePassword.setAttribute(
        "aria-label",
        passwordVisible ? "Mostrar contraseña" : "Ocultar contraseña"
    );
});

// LOGIN
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
        showAuthModal({
            type: "warning",
            title: "Campos incompletos",
            message: "Ingresa tu correo y contraseña."
        });
        return;
    }
    setLoading(true);
    try {
        const response = await loginAdmin(email, password);
        if (!response.ok || !response.data.success) {
            showAuthModal({
                type: "error",
                title: "No se pudo iniciar sesión",
                message: response.data.message || "Las credenciales son incorrectas."
            });
            return;
        }
        showAuthModal({
            type: "success",
            title: "¡Bienvenido!",
            message: response.data.message || "Inicio de sesión exitoso."
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        showAuthModal({
            type: "error",
            title: "Error de conexión",
            message: "No fue posible conectar con el servidor."
        });
    } finally {
        setLoading(false);
    }
});

// LOADING
function setLoading(loading) {
    loginButton.disabled = loading;
    loginButton.classList.toggle("loading", loading);
}