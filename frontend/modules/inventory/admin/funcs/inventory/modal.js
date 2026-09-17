import { InventoryAPI } from '../../../../../api/inventoryApi.js';
import { showMessage, showFormMessage, hideFormMessage } from './messages.js';
import { loadStock } from './stock.js';
import { loadMovements } from './movements.js';

export function openModal(product = null) {
    const form = document.getElementById('inventory-form');
    form.reset();

    if (product) {
        document.getElementById('inventory-product').value = product.id;
    }

    hideFormMessage();

    document.getElementById('inventory-modal').hidden = false;
    document.body.classList.add('admin-modal-open');
}

export function closeModal() {
    document.getElementById('inventory-modal').hidden = true;
    document.body.classList.remove('admin-modal-open');
}

export async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
        product_id: Number(document.getElementById('inventory-product').value),
        movement_type: document.getElementById('inventory-type').value,
        quantity: Number(document.getElementById('inventory-quantity').value),
        description: document.getElementById('inventory-description').value.trim()
    };

    if (!payload.product_id) {
        showFormMessage('Selecciona un producto.');
        return;
    }

    if (!payload.quantity || payload.quantity <= 0) {
        showFormMessage('Indica una cantidad mayor a cero.');
        return;
    }

    const button = document.getElementById('btn-save-inventory');
    button.disabled = true;
    button.textContent = 'Registrando...';

    try {
        await InventoryAPI.adjust(payload);

        closeModal();
        showMessage('Movimiento de inventario registrado correctamente.');

        await loadStock();
        await loadMovements();
    } catch (error) {
        showFormMessage(error.message || 'No fue posible registrar el movimiento.');
    } finally {
        button.disabled = false;
        button.textContent = 'Registrar';
    }
}
