import { loadOrders } from './orders/list.js';
import { closeModal } from './orders/detail.js';

document.addEventListener('DOMContentLoaded', init);

function init() {
    document
        .getElementById('order-status-filter')
        ?.addEventListener('change', loadOrders);

    document
        .getElementById('btn-clear-order-filter')
        ?.addEventListener('click', () => {
            document.getElementById('order-status-filter').value = '';
            loadOrders();
        });

    document
        .getElementById('btn-close-order-modal')
        ?.addEventListener('click', closeModal);

    document
        .querySelector('#order-modal [data-modal-close]')
        ?.addEventListener('click', closeModal);

    loadOrders();
}
