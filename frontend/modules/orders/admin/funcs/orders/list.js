import { OrderAPI } from '../../../../../api/orderApi.js';
import { formatPrice } from '../../../../../funcs/cart.js';
import { escapeHtml, formatDate, formatStatus } from './utils.js';
import { openOrderDetail } from './detail.js';

export async function loadOrders() {
    const tbody = document.getElementById('orders-table-body');
    const status = document.getElementById('order-status-filter')?.value || '';

    tbody.innerHTML = '<tr><td colspan="6" class="admin-loading">Cargando pedidos...</td></tr>';

    try {
        const response = await OrderAPI.adminList(status);
        const orders = response.data || [];
        renderOrders(orders);
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" class="admin-error">${escapeHtml(error.message || 'No fue posible cargar los pedidos.')}</td></tr>`;
    }
}

function renderOrders(orders) {
    const tbody = document.getElementById('orders-table-body');

    if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="admin-empty">Todavía no hay pedidos registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${escapeHtml(order.order_code)}</td>
            <td>${escapeHtml(order.customer_name)}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>${formatPrice(order.total)}</td>
            <td>${formatStatus(order.status)}</td>
            <td>
                <div class="admin-actions">
                    <button type="button" class="admin-action" data-view="${order.id}">Ver detalle</button>
                </div>
            </td>
        </tr>
    `).join('');

    tbody.querySelectorAll('[data-view]').forEach(button => {
        button.addEventListener('click', () => openOrderDetail(button.dataset.view));
    });
}
