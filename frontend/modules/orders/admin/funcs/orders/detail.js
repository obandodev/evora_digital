import { OrderAPI } from '../../../../../api/orderApi.js';
import { formatPrice } from '../../../../../funcs/cart.js';
import { STATUS_LABELS, escapeHtml, formatDate } from './utils.js';
import { loadOrders } from './list.js';

export async function openOrderDetail(id) {
    document.getElementById('order-modal').hidden = false;
    document.body.classList.add('admin-modal-open');

    const content = document.getElementById('order-detail-content');
    content.innerHTML = '<p class="admin-loading">Cargando pedido...</p>';

    try {
        const response = await OrderAPI.get(id);
        renderOrderDetail(response.data);
    } catch (error) {
        content.innerHTML = `<p class="admin-error">${escapeHtml(error.message || 'No fue posible cargar el pedido.')}</p>`;
    }
}

export function closeModal() {
    document.getElementById('order-modal').hidden = true;
    document.body.classList.remove('admin-modal-open');
}

function renderOrderDetail(order) {
    const content = document.getElementById('order-detail-content');
    const items = order.items || [];

    document.getElementById('order-modal-title').textContent = `Pedido ${order.order_code}`;

    content.innerHTML = `
        <div class="order-detail-section">
            <h3>Cliente</h3>
            <div class="order-detail-grid">
                <div><span>Nombre</span><strong>${escapeHtml(order.customer_name)}</strong></div>
                <div><span>Teléfono</span><strong>${escapeHtml(order.customer_phone)}</strong></div>
                <div><span>Correo</span><strong>${escapeHtml(order.customer_email || '—')}</strong></div>
                <div><span>Fecha</span><strong>${formatDate(order.created_at)}</strong></div>
            </div>
        </div>

        <div class="order-detail-section">
            <h3>Entrega</h3>
            <div class="order-detail-grid">
                <div><span>Dirección</span><strong>${escapeHtml(order.delivery_address)}</strong></div>
                <div><span>Ciudad</span><strong>${escapeHtml(order.delivery_city || '—')}</strong></div>
            </div>
        </div>

        ${order.notes ? `
            <div class="order-detail-section">
                <h3>Notas</h3>
                <p class="order-notes">${escapeHtml(order.notes)}</p>
            </div>
        ` : ''}

        <div class="order-detail-section">
            <h3>Productos</h3>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${escapeHtml(item.product_name)}</td>
                            <td>${Number(item.quantity)}</td>
                            <td>${formatPrice(item.unit_price)}</td>
                            <td>${formatPrice(item.subtotal)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="order-detail-grid" style="margin-top:14px;">
                <div><span>Subtotal</span><strong>${formatPrice(order.subtotal)}</strong></div>
                <div><span>Envío</span><strong>${formatPrice(order.shipping_cost)}</strong></div>
                <div><span>Total</span><strong>${formatPrice(order.total)}</strong></div>
            </div>
        </div>

        <div class="order-detail-section">
            <h3>Estado del pedido</h3>
            <div class="order-status-update">
                <select id="order-status-select">
                    ${Object.entries(STATUS_LABELS).map(([value, label]) => `
                        <option value="${value}" ${value === order.status ? 'selected' : ''}>${label}</option>
                    `).join('')}
                </select>

                <button type="button" class="admin-button admin-button-primary" id="btn-update-order-status">
                    Actualizar estado
                </button>
            </div>

            <div class="admin-form-message admin-message" id="order-status-message" hidden></div>
        </div>
    `;

    document
        .getElementById('btn-update-order-status')
        ?.addEventListener('click', () => updateStatus(order.id));
}

async function updateStatus(orderId) {
    const select = document.getElementById('order-status-select');
    const button = document.getElementById('btn-update-order-status');
    const message = document.getElementById('order-status-message');

    button.disabled = true;
    button.textContent = 'Actualizando...';

    try {
        await OrderAPI.updateStatus(orderId, select.value);

        message.hidden = false;
        message.className = 'admin-form-message admin-message success';
        message.textContent = 'Estado actualizado correctamente.';

        await loadOrders();
    } catch (error) {
        message.hidden = false;
        message.className = 'admin-form-message admin-message error';
        message.textContent = error.message || 'No fue posible actualizar el estado.';
    } finally {
        button.disabled = false;
        button.textContent = 'Actualizar estado';
    }
}
