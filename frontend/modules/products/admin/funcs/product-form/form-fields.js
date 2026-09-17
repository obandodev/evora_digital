import { getProductImage, showPreview, removePreview } from './image-preview.js';
import { clearMessage } from './modal.js';

export function renderCategorySelect(categoryList = []) {
    const select =
        document.getElementById('product-category');

    if (!select) {
        return;
    }

    const selectedValue =
        select.value;

    select.innerHTML = `
        <option value="">Seleccionar categoría</option>
        ${categoryList.map(category => `
            <option value="${escapeHtml(category.id)}">
                ${escapeHtml(category.name)}
            </option>
        `).join('')}
    `;

    if (selectedValue) {
        select.value = selectedValue;
    }
}

export function fillForm(product) {
    const id =
        document.getElementById('product-id');

    const name =
        document.getElementById('product-name');

    const category =
        document.getElementById('product-category');

    const brand =
        document.getElementById('product-brand');

    const price =
        document.getElementById('product-price');

    const stock =
        document.getElementById('product-stock');

    const color =
        document.getElementById('product-color');

    const status =
        document.getElementById('product-status');

    const description =
        document.getElementById('product-description');

    if (id) {
        id.value = product.id || '';
    }

    if (name) {
        name.value = product.name || '';
    }

    if (category) {
        category.value = product.category_id || '';
    }

    if (brand) {
        brand.value = product.brand || '';
    }

    if (price) {
        price.value = product.price || '';
    }

    if (stock) {
        stock.value = product.stock ?? 0;
    }

    if (color) {
        color.value = product.color || '';
    }

    if (status) {
        status.value =
            String(product.status || 'ACTIVE').toUpperCase();
    }

    if (description) {
        description.value = product.description || '';
    }

    const image =
        getProductImage(product);

    if (image) {
        showPreview(image);
    } else {
        removePreview();
    }
}

export function resetForm() {
    const form =
        document.getElementById('product-form');

    if (form) {
        form.reset();
    }

    const id =
        document.getElementById('product-id');

    const status =
        document.getElementById('product-status');

    if (id) {
        id.value = '';
    }

    if (status) {
        status.value = 'ACTIVE';
    }

    removePreview();
    clearMessage();
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
