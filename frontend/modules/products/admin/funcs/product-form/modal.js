export function openModal() {
    const modal =
        document.getElementById('product-modal');

    if (!modal) {
        return;
    }

    modal.hidden = false;
    document.body.classList.add('modal-open');
}

export function closeModal() {
    const modal =
        document.getElementById('product-modal');

    if (!modal) {
        return;
    }

    modal.hidden = true;
    document.body.classList.remove('modal-open');

    clearMessage();
}

export function showModalMessage(message) {
    const element =
        document.getElementById('product-modal-message');

    if (!element) {
        return;
    }

    element.textContent = message;
    element.hidden = false;
}

export function clearMessage() {
    const element =
        document.getElementById('product-modal-message');

    if (!element) {
        return;
    }

    element.textContent = '';
    element.hidden = true;
}
