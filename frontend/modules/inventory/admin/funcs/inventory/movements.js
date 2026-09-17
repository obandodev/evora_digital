import { InventoryAPI } from '../../../../../api/inventoryApi.js';
import { escapeHtml, formatType, formatDate } from './utils.js';

export async function loadMovements() {
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
