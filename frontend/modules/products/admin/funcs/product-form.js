import { ProductAPI } from '../../../../api/productApi.js';
import { showProductMessage } from './product-ui.js';
import { openModal, closeModal, showModalMessage, clearMessage } from './product-form/modal.js';
import { previewImage, removePreview } from './product-form/image-preview.js';
import { renderCategorySelect, fillForm, resetForm } from './product-form/form-fields.js';

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
