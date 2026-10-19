/**
 * Genera las <option> de un select de categorías agrupando
 * cada categoría principal con sus subcategorías (<optgroup>).
 *
 * parentSuffix: texto que se agrega a la opción de la categoría principal
 * cuando tiene subcategorías, ej. "general" -> "Maquillaje (general)".
 */
export function buildCategoryOptions(
    categories = [],
    { placeholder = 'Seleccionar categoría', parentSuffix = 'general' } = {}
) {
    const parents = categories.filter(category => !category.parent_id);

    const childrenOf = parentId => categories.filter(
        category => String(category.parent_id) === String(parentId)
    );

    const parentIds = new Set(parents.map(category => String(category.id)));

    // Subcategorías cuyo padre no vino en la lista (por seguridad)
    const orphans = categories.filter(
        category => category.parent_id && !parentIds.has(String(category.parent_id))
    );

    const option = (category, label = category.name) => `
        <option value="${escapeHtml(category.id)}">${escapeHtml(label)}</option>
    `;

    const groups = parents.map(parent => {
        const children = childrenOf(parent.id);

        if (!children.length) {
            return option(parent);
        }

        return `
            <optgroup label="${escapeHtml(parent.name)}">
                ${option(parent, `${parent.name} (${parentSuffix})`)}
                ${children.map(child => option(child)).join('')}
            </optgroup>
        `;
    });

    return `
        <option value="">${escapeHtml(placeholder)}</option>
        ${groups.join('')}
        ${orphans.map(category => option(category)).join('')}
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