import { ProductAPI } from '../api/productApi.js';
import { CategoryAPI } from '../api/categoryApi.js';
import { OrderAPI } from '../api/orderApi.js';

document.addEventListener('DOMContentLoaded', loadDashboard);

async function loadDashboard() {
    await Promise.all([
        loadProducts(),
        loadCategories(),
        loadOrders()
    ]);
}

async function loadProducts() {
    try {
        const response = await ProductAPI.adminList({page:1,limit:1000});
        const products = response.data?.items || response.data || [];
        document.getElementById('stat-products').textContent = products.length;
    } catch (error) {
        console.error('Error cargando productos:', error);
        document.getElementById('stat-products').textContent = '—';
    }
}

async function loadCategories() {
    try {
        const response = await CategoryAPI.adminList();
        const categories = response.data?.items || response.data || [];
        document.getElementById('stat-categories').textContent = categories.length;
    } catch (error) {
        console.error('Error cargando categorías:', error);
        document.getElementById('stat-categories').textContent = '—';
    }
}

async function loadOrders() {
    try {
        const response = await OrderAPI.adminList();
        const orders = response.data?.items || response.data || [];

        document.getElementById('stat-orders').textContent = orders.length;

        const pending = orders.filter(order => order.status === 'PENDING').length;
        document.getElementById('stat-pending').textContent = pending;

        renderRecentOrders(orders.slice(0,5));
    } catch (error) {
        console.error('Error cargando pedidos:', error);
        document.getElementById('stat-orders').textContent = '—';
        document.getElementById('stat-pending').textContent = '—';

        document.getElementById('dashboard-orders').innerHTML =
            '<p class="dashboard-empty">No fue posible cargar los pedidos.</p>';
    }
}

function renderRecentOrders(orders) {
    const container = document.getElementById('dashboard-orders');

    if (!orders.length) {
        container.innerHTML =
            '<p class="dashboard-empty">Todavía no hay pedidos registrados.</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="dashboard-order">
            <div>
                <span class="dashboard-order-code">Pedido #${escapeHtml(order.order_code || order.id)}</span>
                <span class="dashboard-order-customer">${escapeHtml(order.customer_name || 'Cliente')}</span>
            </div>
            <span class="dashboard-order-total">${formatPrice(order.total || order.total_amount || 0)}</span>
            <span class="dashboard-order-status">${formatStatus(order.status)}</span>
        </div>
    `).join('');
}

function formatPrice(value) {
    return new Intl.NumberFormat('es-CO',{
        style:'currency',
        currency:'COP',
        maximumFractionDigits:0
    }).format(Number(value) || 0);
}

function formatStatus(status) {
    const labels = {
        PENDING:'Pendiente',
        CONFIRMED:'Confirmado',
        SHIPPED:'Enviado',
        DELIVERED:'Entregado',
        CANCELLED:'Cancelado'
    };

    return labels[status] || status || 'Sin estado';
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'","&#039;");
}