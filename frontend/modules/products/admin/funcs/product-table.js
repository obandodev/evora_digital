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

function renderProductRow(product) {
    const status = normalizeStatus(product.status);
    const stock = Number(product.stock || 0);

    return `
        <tr>
            <td>
                <div class="product-table-name">
                    ${renderProductImage(product)}

                    <div class="product-table-info">
                        <strong>
                            ${escapeHtml(product.name || 'Sin nombre')}
                        </strong>

                        <span>
                            ${escapeHtml(product.color || 'Sin color')}
                        </span>
                    </div>
                </div>
            </td>

            <td>
                ${escapeHtml(product.category_name || 'Sin categoría')}
            </td>

            <td>
                ${escapeHtml(product.brand || 'Sin marca')}
            </td>

            <td>
                ${formatPrice(product.price)}
            </td>

            <td class="${getStockClass(stock)}">
                ${stock}
            </td>

            <td>
                <span class="product-status ${
                    status === 'ACTIVE'
                        ? 'product-status-active'
                        : 'product-status-inactive'
                }">
                    ${status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </span>
            </td>

            <td>
                <div class="product-actions">
                    <button
                        type="button"
                        class="product-action"
                        data-action="edit"
                        data-id="${escapeHtml(product.id)}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="product-action"
                        data-action="toggle"
                        data-id="${escapeHtml(product.id)}"
                    >
                        ${status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                    </button>

                    <button
                        type="button"
                        class="product-action product-action-danger"
                        data-action="delete"
                        data-id="${escapeHtml(product.id)}"
                    >
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function renderProductImage(product) {
    const image = getProductImage(product);

    if (!image) {
        return `<div class="product-table-image"></div>`;
    }

    return `
        <img
            class="product-table-image"
            src="${escapeHtml(image)}"
            alt="${escapeHtml(product.name || 'Producto')}"
        >
    `;
}

function getProductImage(product) {
    let image = '';

    if (product.image_url) {
        image = product.image_url;
    } else if (product.image) {
        image = product.image;
    } else if (product.main_image) {
        image = product.main_image;
    } else if (
        Array.isArray(product.images) &&
        product.images.length
    ) {
        const item = product.images[0];

        image = typeof item === 'string'
            ? item
            : item.url ||
              item.image_url ||
              item.path ||
              '';
    }

    if (!image) {
        return '';
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('data:') ||
        image.startsWith('/')
    ) {
        return image;
    }

    return `/glam-beauty/backend/uploads/products/${image.split('/').pop()}`;
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

function normalizeStatus(status) {
    return String(status || '').toUpperCase();
}

function getStockClass(stock) {
    if (stock <= 0) {
        return 'product-stock-empty';
    }

    if (stock <= 5) {
        return 'product-stock-low';
    }

    return '';
}

function formatPrice(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(Number(value || 0));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}