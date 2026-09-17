import { renderProductRow } from './product-table/row-render.js';
import { normalizeStatus } from './product-table/utils.js';

let callbacks = {};
let currentProducts = [];

export function initProductTable(options = {}) {
    callbacks = options;

    document.getElementById('products-table-body')
        ?.addEventListener('click', handleAction);
}

export function renderProducts(products) {
    const tbody = document.getElementById('products-table-body');

    if (!tbody) {
        return;
    }

    currentProducts = Array.isArray(products)
        ? products
        : [];

    if (!currentProducts.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="products-empty">
                    No hay productos para mostrar.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = currentProducts
        .map(renderProductRow)
        .join('');
}

export function updateProductSummary(products) {
    const list = Array.isArray(products)
        ? products
        : [];

    const total = list.length;

    const active = list.filter(product =>
        normalizeStatus(product.status) === 'ACTIVE'
    ).length;

    const totalElement =
        document.getElementById('products-total');

    const activeElement =
        document.getElementById('products-active');

    const inactiveElement =
        document.getElementById('products-inactive');

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (activeElement) {
        activeElement.textContent = active;
    }

    if (inactiveElement) {
        inactiveElement.textContent = total - active;
    }
}

function handleAction(event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const id = String(button.dataset.id);

    const product = currentProducts.find(
        item => String(item.id) === id
    );

    if (!product) {
        console.error(
            'No se encontró el producto para la acción:',
            action,
            id
        );

        return;
    }

    if (action === 'edit') {
        callbacks.onEdit?.(product);
        return;
    }

    if (action === 'toggle') {
        callbacks.onToggle?.(product);
        return;
    }

    if (action === 'delete') {
        callbacks.onDelete?.(product);
    }
}
