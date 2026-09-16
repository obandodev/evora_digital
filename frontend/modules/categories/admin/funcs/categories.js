import { CategoryAPI } from '../../../../api/categoryApi.js';

let categories = [];
let pendingConfirmAction = null;

document.addEventListener('DOMContentLoaded', init);

function init() {
    document
        .getElementById('btn-create-category')
        ?.addEventListener('click', () => openForm());

    document
        .getElementById('btn-close-category-modal')
        ?.addEventListener('click', closeForm);

    document
        .getElementById('btn-cancel-category')
        ?.addEventListener('click', closeForm);

    document
        .querySelector('#category-modal [data-modal-close]')
        ?.addEventListener('click', closeForm);

    document
        .getElementById('category-form')
        ?.addEventListener('submit', handleSubmit);

    document
        .querySelector('#category-confirm-modal [data-confirm-close]')
        ?.addEventListener('click', closeConfirm);

    document
        .getElementById('category-confirm-cancel')
        ?.addEventListener('click', closeConfirm);

    document
        .getElementById('category-confirm-submit')
        ?.addEventListener('click', async () => {
            const action = pendingConfirmAction;
            closeConfirm();
            if (action) {
                await action();
            }
        });

    loadCategories();
}

async function loadCategories() {
    const tbody = document.getElementById('categories-table-body');

    try {
        const response = await CategoryAPI.adminList();
        categories = normalizeArray(response.data);
        renderTable();
    } catch (error) {
        categories = [];
        tbody.innerHTML = `<tr><td colspan="4" class="admin-error">${escapeHtml(error.message || 'No fue posible cargar las categorías.')}</td></tr>`;
    }
}

function renderTable() {
    const tbody = document.getElementById('categories-table-body');

    if (!categories.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="admin-empty">Todavía no hay categorías registradas.</td></tr>';
        return;
    }

    tbody.innerHTML = categories.map(category => {
        const isActive = String(category.status || '').toUpperCase() === 'ACTIVE';

        return `
            <tr>
                <td>${escapeHtml(category.name)}</td>
                <td>${escapeHtml(category.description || '—')}</td>
                <td>
                    <span class="admin-status ${isActive ? 'active' : 'inactive'}">
                        ${isActive ? 'Activa' : 'Inactiva'}
                    </span>
                </td>
                <td>
                    <div class="admin-actions">
                        <button type="button" class="admin-action" data-edit="${category.id}">Editar</button>
                        <button type="button" class="admin-action" data-toggle="${category.id}">
                            ${isActive ? 'Desactivar' : 'Activar'}
                        </button>
                        <button type="button" class="admin-action danger" data-delete="${category.id}">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    tbody.querySelectorAll('[data-edit]').forEach(button => {
        button.addEventListener('click', () => openForm(findCategory(button.dataset.edit)));
    });

    tbody.querySelectorAll('[data-toggle]').forEach(button => {
        button.addEventListener('click', () => handleToggle(findCategory(button.dataset.toggle)));
    });

    tbody.querySelectorAll('[data-delete]').forEach(button => {
        button.addEventListener('click', () => handleDelete(findCategory(button.dataset.delete)));
    });
}

function findCategory(id) {
    return categories.find(category => String(category.id) === String(id));
}

function openForm(category = null) {
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

function closeForm() {
    document.getElementById('category-modal').hidden = true;
    document.body.classList.remove('admin-modal-open');
}

async function handleSubmit(event) {
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

function handleToggle(category) {
    if (!category) return;

    const isActive = String(category.status || '').toUpperCase() === 'ACTIVE';
    const newStatus = isActive ? 'INACTIVE' : 'ACTIVE';

    openConfirm({
        title: isActive ? '¿Desactivar categoría?' : '¿Activar categoría?',
        message: isActive
            ? `La categoría "${category.name}" dejará de estar disponible en el catálogo.`
            : `La categoría "${category.name}" volverá a estar disponible en el catálogo.`,
        confirmText: isActive ? 'Desactivar' : 'Activar',
        danger: isActive,
        action: async () => {
            try {
                await CategoryAPI.update(category.id, {
                    name: category.name,
                    description: category.description,
                    status: newStatus
                });
                showMessage(isActive ? 'Categoría desactivada correctamente.' : 'Categoría activada correctamente.');
                await loadCategories();
            } catch (error) {
                showMessage(error.message || 'No fue posible actualizar la categoría.', true);
            }
        }
    });
}

function handleDelete(category) {
    if (!category) return;

    openConfirm({
        title: '¿Eliminar categoría?',
        message: `Vas a eliminar "${category.name}". Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        danger: true,
        action: async () => {
            try {
                await CategoryAPI.remove(category.id);
                showMessage('Categoría eliminada correctamente.');
                await loadCategories();
            } catch (error) {
                showMessage(error.message || 'No fue posible eliminar la categoría.', true);
            }
        }
    });
}

function openConfirm({ title, message, confirmText, danger, action }) {
    document.getElementById('category-confirm-title').textContent = title;
    document.getElementById('category-confirm-message').textContent = message;

    const submitButton = document.getElementById('category-confirm-submit');
    submitButton.textContent = confirmText;
    submitButton.classList.toggle('danger', Boolean(danger));

    pendingConfirmAction = action;

    document.getElementById('category-confirm-modal').hidden = false;
    document.body.classList.add('admin-confirm-open');
}

function closeConfirm() {
    document.getElementById('category-confirm-modal').hidden = true;
    document.body.classList.remove('admin-confirm-open');
    pendingConfirmAction = null;
}

function showMessage(text, isError = false) {
    const el = document.getElementById('categories-message');
    el.hidden = false;
    el.textContent = text;
    el.className = `admin-message ${isError ? 'error' : 'success'}`;
}

function showFormMessage(text) {
    const el = document.getElementById('category-modal-message');
    el.hidden = false;
    el.textContent = text;
    el.className = 'admin-form-message admin-message error';
}

function hideFormMessage() {
    const el = document.getElementById('category-modal-message');
    el.hidden = true;
    el.textContent = '';
}

function normalizeArray(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.categories)) return data.categories;
    return [];
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
