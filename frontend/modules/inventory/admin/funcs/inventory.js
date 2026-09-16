import { ProductAPI } from '../../../../api/productApi.js';
import { InventoryAPI } from '../../../../api/inventoryApi.js';

let products = [];

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

async function loadStock() {
    const tbody = document.getElementById('stock-table-body');

    try {
        const response = await ProductAPI.adminList({ page: 1, limit: 1000 });
        products = response.data?.items || [];

        renderStockTable();
        renderProductOptions();
    } catch (error) {
        products = [];
        tbody.innerHTML = `<tr><td colspan="5" class="admin-error">${escapeHtml(error.message || 'No fue posible cargar el stock.')}</td></tr>`;
    }
}

function renderStockTable() {
    const tbody = document.getElementById('stock-table-body');

    if (!products.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="admin-empty">Todavía no hay productos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => {
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
            const product = products.find(p => String(p.id) === button.dataset.adjust);
            openModal(product);
        });
    });
}

function renderProductOptions() {
    const filterSelect = document.getElementById('inventory-product-filter');
    const modalSelect = document.getElementById('inventory-product');

    const options = products.map(product => `
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

async function loadMovements() {
    const tbody = document.getElementById('movements-table-body');
    const productId = document.getElementById('inventory-product-filter')?.value || null;

    tbody.innerHTML = '<tr><td colspan="8" class="admin-loading">Cargando movimientos...</td></tr>';

    try {
        const response = await InventoryAPI.movements(productId);
        const movements = response.data || [];
        renderMovements(movements);
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="8" class="admin-error">${escapeHtml(error.message || 'No fue posible cargar los movimientos.')}</td></tr>`;
    }
}

function renderMovements(movements) {
    const tbody = document.getElementById('movements-table-body');

    if (!movements.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="admin-empty">Todavía no hay movimientos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = movements.map(movement => `
        <tr>
            <td>${formatDate(movement.created_at)}</td>
            <td>${escapeHtml(movement.product_name || '—')}</td>
            <td>${formatType(movement.movement_type)}</td>
            <td>${Number(movement.quantity)}</td>
            <td>${Number(movement.previous_stock)}</td>
            <td>${Number(movement.new_stock)}</td>
            <td>${escapeHtml(movement.user_name || 'Pedido en línea')}</td>
            <td>${escapeHtml(movement.description || '—')}</td>
        </tr>
    `).join('');
}

function openModal(product = null) {
    const form = document.getElementById('inventory-form');
    form.reset();

    if (product) {
        document.getElementById('inventory-product').value = product.id;
    }

    hideFormMessage();

    document.getElementById('inventory-modal').hidden = false;
    document.body.classList.add('admin-modal-open');
}

function closeModal() {
    document.getElementById('inventory-modal').hidden = true;
    document.body.classList.remove('admin-modal-open');
}

async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
        product_id: Number(document.getElementById('inventory-product').value),
        movement_type: document.getElementById('inventory-type').value,
        quantity: Number(document.getElementById('inventory-quantity').value),
        description: document.getElementById('inventory-description').value.trim()
    };

    if (!payload.product_id) {
        showFormMessage('Selecciona un producto.');
        return;
    }

    if (!payload.quantity || payload.quantity <= 0) {
        showFormMessage('Indica una cantidad mayor a cero.');
        return;
    }

    const button = document.getElementById('btn-save-inventory');
    button.disabled = true;
    button.textContent = 'Registrando...';

    try {
        await InventoryAPI.adjust(payload);

        closeModal();
        showMessage('Movimiento de inventario registrado correctamente.');

        await loadStock();
        await loadMovements();
    } catch (error) {
        showFormMessage(error.message || 'No fue posible registrar el movimiento.');
    } finally {
        button.disabled = false;
        button.textContent = 'Registrar';
    }
}

function showMessage(text, isError = false) {
    const el = document.getElementById('inventory-message');
    el.hidden = false;
    el.textContent = text;
    el.className = `admin-message ${isError ? 'error' : 'success'}`;
}

function showFormMessage(text) {
    const el = document.getElementById('inventory-modal-message');
    el.hidden = false;
    el.textContent = text;
    el.className = 'admin-form-message admin-message error';
}

function hideFormMessage() {
    const el = document.getElementById('inventory-modal-message');
    el.hidden = true;
    el.textContent = '';
}

function formatType(type) {
    const labels = {
        ENTRY: 'Entrada',
        ADJUSTMENT: 'Ajuste',
        EXIT: 'Salida'
    };

    return labels[type] || type || '—';
}

function formatDate(value) {
    if (!value) return '—';

    const date = new Date(value.replace(' ', 'T'));

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
