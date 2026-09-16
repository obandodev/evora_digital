let changeCallback = null;
let searchTimeout = null;

export function initProductFilters({ onChange } = {}) {
    changeCallback = onChange;

    document.getElementById('product-search')
        ?.addEventListener('input', handleSearch);

    document.getElementById('product-category-filter')
        ?.addEventListener('change', triggerChange);

    document.getElementById('product-status-filter')
        ?.addEventListener('change', triggerChange);

    document.getElementById('btn-clear-product-filters')
        ?.addEventListener('click', clearProductFilters);
}

function handleSearch() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        triggerChange();
    }, 400);
}

function triggerChange() {
    changeCallback?.();
}

export function getProductFilters() {
    return {
        search:
            document.getElementById('product-search')
                ?.value
                .trim() || '',

        category_id:
            document.getElementById('product-category-filter')
                ?.value || '',

        status:
            document.getElementById('product-status-filter')
                ?.value || ''
    };
}

export function clearProductFilters() {
    const search =
        document.getElementById('product-search');

    const category =
        document.getElementById('product-category-filter');

    const status =
        document.getElementById('product-status-filter');

    if (search) {
        search.value = '';
    }

    if (category) {
        category.value = '';
    }

    if (status) {
        status.value = '';
    }

    triggerChange();
}

export function renderCategoryFilter(categories = []) {
    const select =
        document.getElementById('product-category-filter');

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="">Todas las categorías</option>
        ${categories.map(category => `
            <option value="${escapeHtml(category.id)}">
                ${escapeHtml(category.name)}
            </option>
        `).join('')}
    `;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}