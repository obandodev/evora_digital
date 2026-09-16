import { OrderAPI } from '../../../../api/orderApi.js';
import { formatPrice } from '../../../../funcs/cart.js';

const STATUS_LABELS = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmado',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado'
};

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

async function loadOrders() {
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

async function openOrderDetail(id) {
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

function closeModal() {
    document.getElementById('order-modal').hidden = true;
    document.body.classList.remove('admin-modal-open');
}

function formatStatus(status) {
    return STATUS_LABELS[status] || status || 'Sin estado';
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
