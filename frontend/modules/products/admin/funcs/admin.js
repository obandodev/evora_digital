import {
    initProductFilters
} from './product-filters.js';

import {
    initProductTable
} from './product-table.js';

import { initProductForm } from './product-form.js';
import {
    initProductConfirmModal
} from './product-confirm-modal.js';

import { state } from './admin/state.js';
import { loadCategories, loadProducts } from './admin/data-loaders.js';
import { handleEdit, handleToggle, handleDelete } from './admin/actions.js';

document.addEventListener('DOMContentLoaded', initProducts);

async function initProducts() {
    initProductConfirmModal();

    initProductFilters({
        onChange: loadProducts
    });

    initProductTable({
        onEdit: handleEdit,
        onToggle: handleToggle,
        onDelete: handleDelete
    });

    initProductForm({
        getCategories: () => state.categories,
        onSaved: loadProducts
    });

    await loadCategories();
    await loadProducts();
}
