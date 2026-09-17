import { ProductAPI } from '../../../../../api/productApi.js';
import { CategoryAPI } from '../../../../../api/categoryApi.js';

import {
    getProductFilters
} from '../product-filters.js';

import {
    renderProducts,
    updateProductSummary
} from '../product-table.js';

import { showProductMessage } from '../product-ui.js';
import { state } from './state.js';

export async function loadCategories() {
    try {
        const response = await CategoryAPI.adminList();

        state.categories = normalizeArray(response.data);

        renderCategoryFilter(state.categories);

        document.dispatchEvent(
            new CustomEvent(
                'products:categories-loaded',
                {
                    detail: state.categories
                }
            )
        );
    } catch (error) {
        console.error(
            'Error cargando categorías:',
            error
        );

        state.categories = [];

        renderCategoryFilter([]);

        showProductMessage(
            error.message ||
            'No fue posible cargar las categorías.'
        );
    }
}

export async function loadProducts() {
    try {
        const response = await ProductAPI.adminList(
            getProductFilters()
        );

        state.products = normalizeProducts(
            response.data
        );

        renderProducts(state.products);
        updateProductSummary(state.products);
    } catch (error) {
        console.error(
            'Error cargando productos:',
            error
        );

        state.products = [];

        renderProducts([]);
        updateProductSummary([]);

        showProductMessage(
            error.message ||
            'No fue posible cargar los productos.'
        );
    }
}

function renderCategoryFilter(categories) {
    const select = document.getElementById(
        'product-category-filter'
    );

    if (!select) return;

    const currentValue = select.value;

    select.innerHTML = `
        <option value="">Todas las categorías</option>
        ${categories.map(category => `
            <option value="${escapeHtml(category.id)}">
                ${escapeHtml(category.name)}
            </option>
        `).join('')}
    `;

    if (
        currentValue &&
        categories.some(
            category => String(category.id) === String(currentValue)
        )
    ) {
        select.value = currentValue;
    }
}

function normalizeProducts(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.products)) {
        return data.products;
    }

    return [];
}

function normalizeArray(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.categories)) {
        return data.categories;
    }

    return [];
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
