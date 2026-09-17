import { CategoryAPI } from '../../../../../api/categoryApi.js';
import { state } from './state.js';
import { normalizeArray, escapeHtml } from './utils.js';
import { renderTable } from './table.js';

export async function loadCategories() {
    const tbody = document.getElementById('categories-table-body');

    try {
        const response = await CategoryAPI.adminList();
        state.categories = normalizeArray(response.data);
        renderTable();
    } catch (error) {
        state.categories = [];
        tbody.innerHTML = `<tr><td colspan="4" class="admin-error">${escapeHtml(error.message || 'No fue posible cargar las categorías.')}</td></tr>`;
    }
}
