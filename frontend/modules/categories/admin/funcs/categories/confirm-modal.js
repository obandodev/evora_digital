import { state } from './state.js';

export function openConfirm({ title, message, confirmText, danger, action }) {
    document.getElementById('category-confirm-title').textContent = title;
    document.getElementById('category-confirm-message').textContent = message;

    const submitButton = document.getElementById('category-confirm-submit');
    submitButton.textContent = confirmText;
    submitButton.classList.toggle('danger', Boolean(danger));

    state.pendingConfirmAction = action;

    document.getElementById('category-confirm-modal').hidden = false;
    document.body.classList.add('admin-confirm-open');
}

export function closeConfirm() {
    document.getElementById('category-confirm-modal').hidden = true;
    document.body.classList.remove('admin-confirm-open');
    state.pendingConfirmAction = null;
}
