import { state } from './categories/state.js';
import { openForm, closeForm, handleSubmit } from './categories/form.js';
import { closeConfirm } from './categories/confirm-modal.js';
import { loadCategories } from './categories/data.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
    document
        .getElementById('btn-create-category')
        ?.addEventListener('click', () => openForm());

    document
        .getElementById('btn-close-category-modal')
        ?.addEventListener('click', closeForm);

    document
        .getElementById('btn-cancel-category')
        ?.addEventListener('click', closeForm);

    document
        .querySelector('#category-modal [data-modal-close]')
        ?.addEventListener('click', closeForm);

    document
        .getElementById('category-form')
        ?.addEventListener('submit', handleSubmit);

    document
        .querySelector('#category-confirm-modal [data-confirm-close]')
        ?.addEventListener('click', closeConfirm);

    document
        .getElementById('category-confirm-cancel')
        ?.addEventListener('click', closeConfirm);

    document
        .getElementById('category-confirm-submit')
        ?.addEventListener('click', async () => {
            const action = state.pendingConfirmAction;
            closeConfirm();
            if (action) {
                await action();
            }
        });

    loadCategories();
}
