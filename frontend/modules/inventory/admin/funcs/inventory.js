import { loadStock } from './inventory/stock.js';
import { loadMovements } from './inventory/movements.js';
import { openModal, closeModal, handleSubmit } from './inventory/modal.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
    document
        .getElementById('btn-open-adjust')
        ?.addEventListener('click', () => openModal());

    document
        .getElementById('btn-close-inventory-modal')
        ?.addEventListener('click', closeModal);

    document
        .getElementById('btn-cancel-inventory')
        ?.addEventListener('click', closeModal);

    document
        .querySelector('#inventory-modal [data-modal-close]')
        ?.addEventListener('click', closeModal);

    document
        .getElementById('inventory-form')
        ?.addEventListener('submit', handleSubmit);

    document
        .getElementById('inventory-product-filter')
        ?.addEventListener('change', loadMovements);

    document
        .getElementById('btn-clear-inventory-filter')
        ?.addEventListener('click', () => {
            document.getElementById('inventory-product-filter').value = '';
            loadMovements();
        });

    loadStock();
    loadMovements();
}
