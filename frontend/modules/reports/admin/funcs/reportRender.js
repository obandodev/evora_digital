import {
    formatCurrency,
    formatNumber,
    escapeHtml
} from './reportFormat.js';

const getElement = id =>
    document.getElementById(id);

export function renderSummary(data = {}) {
    const sales = data.sales || {};
    const inventory = data.inventory || {};

    const values = {
        'summary-sales': formatCurrency(sales.total_sales),
        'summary-orders': formatNumber(sales.delivered_orders),
        'summary-average': formatCurrency(sales.average_order),
        'summary-inventory': formatCurrency(inventory.inventory_value),
        'summary-products': formatNumber(inventory.total_products),
        'summary-units': formatNumber(inventory.total_units),
        'summary-low': formatNumber(inventory.low_stock),
        'summary-out': formatNumber(inventory.out_of_stock)
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = getElement(id);

        if (element) {
            element.textContent = value;
        }
    });
}

export function renderInventoryCategories(rows = []) {
    getElement('inventory-category-body').innerHTML =
        rows.length
            ? rows.map(row => `
                <tr>
                    <td>${escapeHtml(row.category_name)}</td>
                    <td>${formatNumber(row.product_count)}</td>
                    <td>${formatNumber(row.total_units)}</td>
                    <td>${formatCurrency(row.inventory_value)}</td>
                </tr>
            `).join('')
            : emptyRow(4);
}

export function renderInventoryProducts(rows = []) {
    getElement('inventory-products-body').innerHTML =
        rows.length
            ? rows.map(row => `
                <tr>
                <td>${escapeHtml(row.product_name)}</td>
                <td>${escapeHtml(row.category_name)}</td>
                    <td>${formatCurrency(row.price)}</td>
                    <td>${formatNumber(row.stock)}</td>
                    <td>${formatNumber(row.minimum_stock)}</td>
                    <td>${formatCurrency(row.inventory_value)}</td>
                    <td>
                        <span class="stock-badge stock-${String(row.stock_status).toLowerCase()}">
                            ${statusLabel(row.stock_status)}
                        </span>
                    </td>
                </tr>
            `).join('')
            : emptyRow(7);
}

export function renderSalesCategories(rows = []) {
    getElement('sales-category-body').innerHTML =
        rows.length
            ? rows.map(row => `
                <tr>
                    <td>${escapeHtml(row.category_name)}</td>
                    <td>${formatNumber(row.units_sold)}</td>
                    <td>${formatCurrency(row.sales_value)}</td>
                </tr>
            `).join('')
            : emptyRow(3);
}

export function renderSalesProducts(rows = []) {
    getElement('sales-products-body').innerHTML =
        rows.length
            ? rows.map(row => `
                <tr>
                    <td>${escapeHtml(row.product_name)}</td>
                    <td>${escapeHtml(row.category_name)}</td>
                    <td>${formatNumber(row.units_sold)}</td>
                    <td>${formatCurrency(row.sales_value)}</td>
                </tr>
            `).join('')
            : emptyRow(4);
}

function statusLabel(status) {
    return {
        OUT_OF_STOCK: 'Agotado',
        LOW: 'Stock bajo',
        AVAILABLE: 'Disponible'
    }[status] || status;
}

function emptyRow(columns) {
    return `
        <tr>
            <td colspan="${columns}" class="report-empty">
                Sin datos para mostrar.
            </td>
        </tr>
    `;
}