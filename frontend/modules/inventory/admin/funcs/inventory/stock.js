import { ProductAPI } from '../../../../../api/productApi.js';
import { state } from './state.js';
import { escapeHtml } from './utils.js';
import { openModal } from './modal.js';

export async function loadStock() {
    const tbody = document.getElementById('stock-table-body');

    try {
        const response = await ProductAPI.adminList({ page: 1, limit: 1000 });
        state.products = response.data?.items || [];

        renderStockTable();
        renderProductOptions();
    } catch (error) {
        state.products = [];
        tbody.innerHTML = `<tr><td colspan="5" class="admin-error">${escapeHtml(error.message || 'No fue posible cargar el stock.')}</td></tr>`;
    }
}

function renderStockTable() {
    const tbody = document.getElementById('stock-table-body');

    if (!state.products.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="admin-empty">Todavía no hay productos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = state.products.map(product => {
        const stock = Number(product.stock ?? 0);

        return `
            <tr>
                <td>${escapeHtml(product.name)}</td>
                <td>${escapeHtml(product.category_name || '—')}</td>
                <td>${escapeHtml(product.brand || '—')}</td>
                <td class="${stock <= 5 ? 'inventory-stock-low' : ''}">${stock}</td>
                <td>
                    <div class="admin-actions">
                        <button type="button" class="admin-action" data-adjust="${product.id}">Ajustar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.querySelectorAll('[data-adjust]').forEach(button => {
        button.addEventListener('click', () => {
            const product = state.products.find(p => String(p.id) === button.dataset.adjust);
            openModal(product);
        });
    });
}

function renderProductOptions() {
    const filterSelect = document.getElementById('inventory-product-filter');
    const modalSelect = document.getElementById('inventory-product');

    const options = state.products.map(product => `
        <option value="${product.id}">${escapeHtml(product.name)}</option>
    `).join('');

    if (filterSelect) {
        const current = filterSelect.value;
        filterSelect.innerHTML = `<option value="">Todos los productos</option>${options}`;
        filterSelect.value = current;
    }

    if (modalSelect) {
        modalSelect.innerHTML = `<option value="">Seleccionar producto</option>${options}`;
    }
}
