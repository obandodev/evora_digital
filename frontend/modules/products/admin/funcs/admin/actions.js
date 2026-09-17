import { ProductAPI } from '../../../../../api/productApi.js';
import { showProductMessage } from '../product-ui.js';
import { openProductConfirmModal } from '../product-confirm-modal.js';
import { loadProducts } from './data-loaders.js';

export function handleEdit(product) {
    document.dispatchEvent(
        new CustomEvent(
            'products:edit',
            {
                detail: product
            }
        )
    );
}

export async function handleToggle(product) {
    const isActive = String(
        product.status || ''
    ).toUpperCase() === 'ACTIVE';

    const newStatus = isActive
        ? 'INACTIVE'
        : 'ACTIVE';

    const confirmed = await openProductConfirmModal({
        titleText: isActive
            ? '¿Desactivar producto?'
            : '¿Activar producto?',
        messageText: isActive
            ? `El producto "${product.name}" dejará de estar disponible en el catálogo.`
            : `El producto "${product.name}" volverá a estar disponible en el catálogo.`,
        confirmText: isActive
            ? 'Desactivar'
            : 'Activar',
        eyebrowText: isActive
            ? 'Desactivar'
            : 'Activar',
        danger: isActive
    });

    if (!confirmed) return;

    try {
        const formData = new FormData();

        formData.append(
            'category_id',
            product.category_id || ''
        );

        formData.append(
            'brand',
            product.brand || ''
        );

        formData.append(
            'name',
            product.name || ''
        );

        formData.append(
            'description',
            product.description || ''
        );

        formData.append(
            'price',
            product.price || ''
        );

        formData.append(
            'color',
            product.color || ''
        );

        formData.append(
            'status',
            newStatus
        );

        formData.append(
            'stock',
            product.stock || 0
        );

        await ProductAPI.update(
            product.id,
            formData
        );

        showProductMessage(
            isActive
                ? 'Producto desactivado correctamente.'
                : 'Producto activado correctamente.'
        );

        await loadProducts();
    } catch (error) {
        showProductMessage(
            error.message ||
            'No fue posible actualizar el estado del producto.'
        );
    }
}

export async function handleDelete(product) {
    const confirmed = await openProductConfirmModal({
        titleText: '¿Eliminar producto?',
        messageText: `Vas a eliminar "${product.name}". Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        eyebrowText: 'Eliminar producto',
        danger: true
    });

    if (!confirmed) return;

    try {
        await ProductAPI.remove(
            product.id
        );

        showProductMessage(
            'Producto eliminado correctamente.'
        );

        await loadProducts();
    } catch (error) {
        showProductMessage(
            error.message ||
            'No fue posible eliminar el producto.'
        );
    }
}
