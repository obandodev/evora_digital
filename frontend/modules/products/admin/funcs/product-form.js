import { ProductAPI } from '../../../../api/productApi.js';
import { showProductMessage } from './product-ui.js';

let categories = [];
let editingProduct = null;
let savedCallback = null;

export function initProductForm(options = {}) {
    categories = options.getCategories?.() || [];
    savedCallback = options.onSaved;

    document.getElementById('btn-create-product')
        ?.addEventListener('click', openCreate);

    document.getElementById('btn-close-product-modal')
        ?.addEventListener('click', closeModal);

    document.getElementById('btn-cancel-product')
        ?.addEventListener('click', closeModal);

    document.getElementById('product-form')
        ?.addEventListener('submit', saveProduct);

    document.getElementById('product-image')
        ?.addEventListener('change', previewImage);

    document.getElementById('btn-remove-preview')
        ?.addEventListener('click', removePreview);

    document.addEventListener(
        'products:categories-loaded',
        event => {
            categories = Array.isArray(event.detail)
                ? event.detail
                : [];

            renderCategorySelect(categories);
        }
    );

    document.addEventListener(
        'products:edit',
        event => {
            if (!event.detail) {
                return;
            }

            openEdit(event.detail);
        }
    );
}

function openCreate() {
    editingProduct = null;

    resetForm();

    const title = document.getElementById('product-modal-title');
    const saveButton = document.getElementById('btn-save-product');
    const stockInput = document.getElementById('product-stock');
    const stockHint = document.getElementById('product-stock-hint');

    if (title) {
        title.textContent = 'Nuevo producto';
    }

    if (saveButton) {
        saveButton.textContent = 'Guardar producto';
    }

    if (stockInput) {
        stockInput.disabled = false;
    }

    if (stockHint) {
        stockHint.textContent = 'Cantidad con la que se crea el producto.';
    }

    renderCategorySelect(categories);
    openModal();

    document.getElementById('product-name')?.focus();
}

function openEdit(product) {
    editingProduct = product;

    renderCategorySelect(categories);
    fillForm(product);

    document.getElementById('product-modal-title').textContent =
        'Editar producto';

    document.getElementById('btn-save-product').textContent =
        'Guardar cambios';

    const stockInput = document.getElementById('product-stock');
    const stockHint = document.getElementById('product-stock-hint');

    if (stockInput) {
        stockInput.disabled = true;
    }

    if (stockHint) {
        stockHint.textContent =
            'El stock no se edita aquí. Ve al módulo de Inventario para registrar entradas o ajustes.';
    }

    openModal();

    document.getElementById('product-name')?.focus();
}

function renderCategorySelect(categoryList = []) {
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

function fillForm(product) {
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

function resetForm() {
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

async function saveProduct(event) {
    event.preventDefault();

    const button =
        document.getElementById('btn-save-product');

    const form =
        event.currentTarget;

    const formData =
        new FormData(form);

    const isEditing =
        Boolean(editingProduct);

    try {
        if (button) {
            button.disabled = true;
            button.textContent = 'Guardando...';
        }

        if (isEditing) {
            await ProductAPI.update(
                editingProduct.id,
                formData
            );

            showProductMessage(
                'Producto actualizado correctamente.'
            );
        } else {
            await ProductAPI.create(formData);

            showProductMessage(
                'Producto creado correctamente.'
            );
        }

        closeModal();

        await savedCallback?.();

        editingProduct = null;
    } catch (error) {
        console.error(
            'Error guardando producto:',
            error
        );

        showModalMessage(
            error.message ||
            'No fue posible guardar el producto.'
        );
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = isEditing
                ? 'Guardar cambios'
                : 'Guardar producto';
        }
    }
}

function previewImage(event) {
    const file =
        event.target.files?.[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith('image/')) {
        showModalMessage(
            'Selecciona un archivo de imagen válido.'
        );

        event.target.value = '';

        return;
    }

    const reader =
        new FileReader();

    reader.onload = readerEvent => {
        showPreview(readerEvent.target.result);
    };

    reader.readAsDataURL(file);
}

function showPreview(src) {
    const container =
        document.getElementById('product-image-preview');

    const image =
        document.getElementById('product-preview-image');

    if (!container || !image) {
        return;
    }

    image.src = src;
    container.hidden = false;
}

function removePreview() {
    const container =
        document.getElementById('product-image-preview');

    const image =
        document.getElementById('product-preview-image');

    const input =
        document.getElementById('product-image');

    if (container) {
        container.hidden = true;
    }

    if (image) {
        image.src = '';
    }

    if (input) {
        input.value = '';
    }
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

function openModal() {
    const modal =
        document.getElementById('product-modal');

    if (!modal) {
        return;
    }

    modal.hidden = false;
    document.body.classList.add('modal-open');
}

function closeModal() {
    const modal =
        document.getElementById('product-modal');

    if (!modal) {
        return;
    }

    modal.hidden = true;
    document.body.classList.remove('modal-open');

    clearMessage();
}

function showModalMessage(message) {
    const element =
        document.getElementById('product-modal-message');

    if (!element) {
        return;
    }

    element.textContent = message;
    element.hidden = false;
}

function clearMessage() {
    const element =
        document.getElementById('product-modal-message');

    if (!element) {
        return;
    }

    element.textContent = '';
    element.hidden = true;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}