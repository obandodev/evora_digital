import { ProductAPI } from '../api/productApi.js';
import { formatPrice } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('featured-products');

    if (!container) {
        return;
    }

    try {
        const response = await ProductAPI.list({
            page: 1,
            limit: 4
        });

        const products = response.data?.items || [];

        if (!products.length) {
            container.innerHTML = '<p class="empty-message">No hay productos disponibles.</p>';
            return;
        }

        container.innerHTML = products.map(product => {
            const image = product.main_image
                ? `/glam-beauty/backend/uploads/products/${product.main_image}`
                : '';

            return `
                <article class="product-preview">
                    <a href="product.php?id=${product.id}" class="product-preview-image">
                        ${image
                            ? `<img src="${image}" alt="${escapeHtml(product.name)}">`
                            : '<div class="product-no-image">Glam Beauty</div>'
                        }
                    </a>
                    <div class="product-preview-info">
                        <span>${escapeHtml(product.brand || 'Glam Beauty')}</span>
                        <h3>${escapeHtml(product.name)}</h3>
                        <strong>${formatPrice(product.price)}</strong>
                    </div>
                </article>
            `;
        }).join('');
    } catch (error) {
        container.innerHTML = `
            <p class="empty-message">
                No fue posible cargar los productos.
            </p>
        `;
        console.error(error);
    }
});

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}