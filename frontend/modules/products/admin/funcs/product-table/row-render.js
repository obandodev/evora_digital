import {
    getProductImage,
    normalizeStatus,
    getStockClass,
    formatPrice,
    escapeHtml
} from './utils.js';

export function renderProductRow(product) {
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
                ${escapeHtml(
                    [product.parent_category_name, product.category_name]
                        .filter(Boolean)
                        .join(' · ') || 'Sin categoría'
                )}
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
