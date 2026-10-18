import { ProductAPI } from '../api/productApi.js';
import { CategoryAPI } from '../api/categoryApi.js';
import { formatPrice } from './cart.js';

let currentPage = 1;
const limit = 12;

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadProducts();

    document
        .getElementById('catalog-filters')
        ?.addEventListener('submit', event => {
            event.preventDefault();
            currentPage = 1;
            loadProducts();
        });
});

async function loadCategories() {
    const select = document.getElementById('category-filter');

    if (!select) {
        return;
    }

    try {
        const response = await CategoryAPI.list();
        const categories = response.data || [];

        select.innerHTML = `
            <option value="">Todas las categorías</option>
            ${categories.map(category => `
                <option value="${category.id}">
                    ${escapeHtml(category.name)}
                </option>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

async function loadProducts() {
    const container = document.getElementById('catalog-products');
    const pagination = document.getElementById('catalog-pagination');

    if (!container) {
        return;
    }

    const search = document.getElementById('search-filter')?.value.trim() || '';
    const categoryId = document.getElementById('category-filter')?.value || '';
    const brand = document.getElementById('brand-filter')?.value.trim() || '';

    container.innerHTML = '<p class="loading-message">Cargando productos...</p>';

    try {
        const response = await ProductAPI.list({
            page: currentPage,
            limit,
            search,
            category_id: categoryId,
            brand
        });

        const data = response.data || {};
        const products = data.items || [];

        if (!products.length) {
            container.innerHTML = `
                <p class="empty-message">
                    No encontramos productos con esos filtros.
                </p>
            `;

            if (pagination) {
                pagination.innerHTML = '';
            }

            return;
        }

        container.innerHTML = products.map(renderProduct).join('');

        renderPagination(
            pagination,
            data.pagination?.total_pages || 1,
            data.pagination?.page || currentPage
        );
    } catch (error) {
        container.innerHTML = `
            <p class="empty-message">
                No fue posible cargar el catálogo.
            </p>
        `;

        console.error(error);
    }
}

function renderProduct(product) {
    const image = product.main_image
        ? `${window.GLAM.IMAGE_URL}/${product.main_image}`
        : '';

    return `
        <article class="catalog-product">
            <a href="product.php?id=${product.id}" class="catalog-product-image">
                ${image
                    ? `<img src="${image}" alt="${escapeHtml(product.name)}">`
                    : '<div class="product-no-image">Glam Beauty</div>'
                }
            </a>

            <div class="catalog-product-info">
                <span class="product-brand">
                    ${escapeHtml(product.brand || 'Glam Beauty')}
                </span>

                <h3>
                    <a href="product.php?id=${product.id}">
                        ${escapeHtml(product.name)}
                    </a>
                </h3>

                <p class="product-category">
                    ${escapeHtml(product.category_name || '')}
                </p>

                <strong>${formatPrice(product.price)}</strong>
            </div>
        </article>
    `;
}

function renderPagination(container, totalPages, page) {
    if (!container || totalPages <= 1) {
        if (container) {
            container.innerHTML = '';
        }
        return;
    }

    let html = '';

    if (page > 1) {
        html += `
            <button type="button" data-page="${page - 1}">
                Anterior
            </button>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button
                type="button"
                class="${i === page ? 'active' : ''}"
                data-page="${i}"
            >
                ${i}
            </button>
        `;
    }

    if (page < totalPages) {
        html += `
            <button type="button" data-page="${page + 1}">
                Siguiente
            </button>
        `;
    }

    container.innerHTML = html;

    container.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', () => {
            currentPage = Number(button.dataset.page);
            loadProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
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