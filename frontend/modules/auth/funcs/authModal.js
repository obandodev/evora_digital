const authModal = document.getElementById("authModal");
const authModalClose = document.getElementById("authModalClose");
const authModalButton = document.getElementById("authModalButton");
const authModalIcon = document.getElementById("authModalIcon");
const authModalTitle = document.getElementById("authModalTitle");
const authModalMessage = document.getElementById("authModalMessage");
const authModalOverlay = document.querySelector("[data-modal-close]");


export function showAuthModal({
    type = "info",
    title = "Mensaje",
    message = "",
    buttonText = "Entendido"
}) {
    authModalIcon.className =
        `auth-modal-icon ${type}`;
    authModalIcon.textContent =
        getIcon(type);
    authModalTitle.textContent =
        title;
    authModalMessage.textContent =
        message;
    authModalButton.textContent =
        buttonText;
    authModal.classList.add("active");
    authModal.setAttribute(
        "aria-hidden",
        "false"
    );
}


export function closeAuthModal() {
    authModal.classList.remove("active");
    authModal.setAttribute(
        "aria-hidden",
        "true"
    );
}

function getIcon(type) {
    switch (type) {
        case "success":
            return "✓";
        case "error":
            return "!";
        case "warning":
            return "⚠";
        default:
            return "i";
    }
}


authModalClose.addEventListener(
    "click",
    closeAuthModal
);

authModalButton.addEventListener(
    "click",
    closeAuthModal
);

authModalOverlay.addEventListener(
    "click",
    closeAuthModal
);

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "Escape" &&
            authModal.classList.contains("active")
        ) {
            closeAuthModal();
        }
    }
);