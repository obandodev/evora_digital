<?php

function renderLoginForm(): void
{
    ?>
    <div class="login-card">
        <div class="login-header">
            <span class="login-eyebrow">
                PANEL ADMINISTRATIVO
            </span>
            <h2>
                Bienvenido
            </h2>
            <p>
                Ingresa tus credenciales para continuar.
            </p>
        </div>
        <form
            id="loginForm"
            novalidate
        >
            <div class="form-group">
                <label for="email">
                    Correo electrónico
                </label>
                <div class="input-wrapper">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="admin@glambeauty.com"
                        autocomplete="email"
                        required
                    >
                </div>
            </div>
            <div class="form-group">
                <div class="password-label">
                    <label for="password">
                        Contraseña
                    </label>
                </div>
                <div class="input-wrapper">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Ingresa tu contraseña"
                        autocomplete="current-password"
                        required
                    >
                    <button
                        type="button"
                        id="togglePassword"
                        class="toggle-password"
                        aria-label="Mostrar contraseña"
                    >
                        Mostrar
                    </button>
                </div>
            </div>
            <button
                type="submit"
                id="loginButton"
                class="login-button"
            >
                <span class="button-text">
                    Iniciar sesión
                </span>
                <span
                    class="button-loader"
                    aria-hidden="true"
                ></span>
            </button>
        </form>
        <p class="login-footer">
            Acceso exclusivo para administradores
        </p>
    </div>
    <?php
}