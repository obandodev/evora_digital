import { CategoryAPI } from '../../../../../api/categoryApi.js';
import { hideFormMessage, showFormMessage, showMessage } from './messages.js';
import { loadCategories } from './data.js';

export function openForm(category = null) {
    const form = document.getElementById('category-form');
    form.reset();

    document.getElementById('category-modal-title').textContent =
        category ? 'Editar categoría' : 'Nueva categoría';

    document.getElementById('category-id').value = category?.id || '';
    document.getElementById('category-name').value = category?.name || '';
    document.getElementById('category-description').value = category?.description || '';
    document.getElementById('category-status').value = category?.status || 'ACTIVE';

    hideFormMessage();

    document.getElementById('category-modal').hidden = false;
    document.body.classList.add('admin-modal-open');
}

export function closeForm() {
    document.getElementById('category-modal').hidden = true;
    document.body.classList.remove('admin-modal-open');
}

export async function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('category-id').value;

    const payload = {
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
