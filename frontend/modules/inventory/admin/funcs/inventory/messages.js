export function showMessage(text, isError = false) {
    const el = document.getElementById('inventory-message');
    el.hidden = false;
    el.textContent = text;
    el.className = `admin-message ${isError ? 'error' : 'success'}`;
}

export function showFormMessage(text) {
    const el = document.getElementById('inventory-modal-message');
    el.hidden = false;
    el.textContent = text;
    el.className = 'admin-form-message admin-message error';
}

export function hideFormMessage() {
    const el = document.getElementById('inventory-modal-message');
    el.hidden = true;
    el.textContent = '';
}
