import { CategoryAPI } from '../../../../../api/categoryApi.js';
import { state } from './state.js';
import { hideFormMessage, showFormMessage, showMessage } from './messages.js';
import { loadCategories } from './data.js';
import { escapeHtml } from './utils.js';

export function openForm(category = null) {
    const form = document.getElementById('category-form');
    form.reset();

    document.getElementById('category-modal-title').textContent =
        category ? 'Editar categoría' : 'Nueva categoría';

    document.getElementById('category-id').value = category?.id || '';
    document.getElementById('category-name').value = category?.name || '';
    document.getElementById('category-description').value = category?.description || '';
    document.getElementById('category-status').value = category?.status || 'ACTIVE';

    fillParentSelect(category);
    hideFormMessage();

    document.getElementById('category-modal').hidden = false;
    document.body.classList.add('admin-modal-open');
}

/**
 * Llena el select "Categoría padre" solo con categorías principales
 * (máximo dos niveles) y sin incluir la propia categoría que se edita.
 */
function fillParentSelect(category) {
    const select = document.getElementById('category-parent');
    const hint = document.getElementById('category-parent-hint');

    if (!select) {
        return;
    }

    const selfId = category?.id ? String(category.id) : '';

    const hasChildren = Boolean(selfId) && state.categories.some(
        item => String(item.parent_id) === selfId
    );

    const parents = state.categories.filter(
        item => !item.parent_id && String(item.id) !== selfId
    );

    select.innerHTML = `
        <option value="">Ninguna (categoría principal)</option>
        ${parents.map(item => `
            <option value="${escapeHtml(item.id)}">
                ${escapeHtml(item.name)}
            </option>
        `).join('')}
    `;

    select.value = category?.parent_id ? String(category.parent_id) : '';
    select.disabled = hasChildren;

    if (hint) {
        hint.hidden = !hasChildren;
        hint.textContent = hasChildren
            ? 'Esta categoría tiene subcategorías, por eso no puede ser subcategoría de otra.'
            : '';
    }
}

export function closeForm() {
    document.getElementById('category-modal').hidden = true;
    document.body.classList.remove('admin-modal-open');
}

export async function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('category-id').value;

    const payload = {
        parent_id: document.getElementById('category-parent')?.value || null,
        name: document.getElementById('category-name').value.trim(),
        description: document.getElementById('category-description').value.trim(),
        status: document.getElementById('category-status').value
    };

    const button = document.getElementById('btn-save-category');
    button.disabled = true;
    button.textContent = 'Guardando...';

    try {
        if (id) {
            await CategoryAPI.update(id, payload);
            showMessage('Categoría actualizada correctamente.');
        } else {
            await CategoryAPI.create(payload);
            showMessage('Categoría creada correctamente.');
        }

        closeForm();
        await loadCategories();
    } catch (error) {
        showFormMessage(error.message || 'No fue posible guardar la categoría.');
    } finally {
        button.disabled = false;
        button.textContent = 'Guardar categoría';
    }
}