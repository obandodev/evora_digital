<?php

function renderAuthModal(): void
{
    ?>
    <div
        id="authModal"
        class="auth-modal"
        aria-hidden="true"
    >
        <div
            class="auth-modal-overlay"
            data-modal-close
        ></div>
        <div
            class="auth-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="authModalTitle"
        >
            <button
                type="button"
                class="auth-modal-close"
                id="authModalClose"
                aria-label="Cerrar"
            >
                &times;
            </button>
            <div
                id="authModalIcon"
                class="auth-modal-icon"
            ></div>
            <div class="auth-modal-body">
                <h3 id="authModalTitle">
                    Mensaje
                </h3>
                <p id="authModalMessage">
                </p>
            </div>
            <button
                type="button"
                id="authModalButton"
                class="auth-modal-button"
            >
                Entendido
            </button>
        <div>
    </div>
    <?php
}