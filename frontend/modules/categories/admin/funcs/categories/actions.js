import { CategoryAPI } from '../../../../../api/categoryApi.js';
import { openConfirm } from './confirm-modal.js';
import { showMessage } from './messages.js';
import { loadCategories } from './data.js';

export function handleToggle(category) {
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
                    parent_id: category.parent_id || null,
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

export function handleDelete(category) {
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
