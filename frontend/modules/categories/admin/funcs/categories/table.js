import { state } from './state.js';
import { escapeHtml } from './utils.js';
import { openForm } from './form.js';
import { handleToggle, handleDelete } from './actions.js';

export function renderTable() {
    const tbody = document.getElementById('categories-table-body');

    if (!state.categories.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="admin-empty">Todavía no hay categorías registradas.</td></tr>';
        return;
    }

    tbody.innerHTML = state.categories.map(category => {
        const isActive = String(category.status || '').toUpperCase() === 'ACTIVE';
        const isChild = Boolean(category.parent_id);

        const nameCell = isChild
            ? `<td style="padding-left: 36px;">↳ ${escapeHtml(category.name)}</td>`
            : `<td><strong>${escapeHtml(category.name)}</strong></td>`;

        return `
            <tr>
                ${nameCell}
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
    return state.categories.find(category => String(category.id) === String(id));
}