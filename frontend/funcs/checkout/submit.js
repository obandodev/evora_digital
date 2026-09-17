import { getCart, clearCart, formatPrice } from '../cart.js';
import { OrderAPI } from '../../api/orderApi.js';
import { escapeHtml } from './utils.js';
import { renderEmptyCheckout } from './empty.js';

export async function submitOrder(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('.checkout-submit');
    const message = document.getElementById('checkout-message');

    const cart = getCart();

    if (!cart.length) {
        renderEmptyCheckout(
            document.getElementById('checkout-container')
        );
        return;
    }

    const formData = new FormData(form);

    const order = {
        customer_name: formData.get('customer_name').trim(),
        customer_phone: formData.get('customer_phone').trim(),
        customer_email: formData.get('customer_email').trim(),
        delivery_address: formData.get('delivery_address').trim(),
        delivery_city: formData.get('delivery_city').trim(),
        notes: formData.get('notes').trim(),
        items: cart.map(item => ({
            product_id: Number(item.id),
            quantity: Number(item.quantity)
        }))
    };

    button.disabled = true;
    button.textContent = 'Procesando pedido...';

    message.hidden = true;
    message.textContent = '';

        try {
            const response = await OrderAPI.create(order);
            const data = response.data;

            clearCart();

            renderSuccess(data);
            openOrderSuccessModal(data);
        } catch (error) {
        message.hidden = false;
        message.className = 'checkout-message error';
        message.textContent = error.message || 'No fue posible realizar el pedido.';

        button.disabled = false;
        button.textContent = 'Confirmar pedido';
    }
}

function renderSuccess(data) {
    const container = document.getElementById('checkout-container');

    container.innerHTML = `
        <div class="order-success">
            <span class="success-number">✓</span>

            <span class="eyebrow">PEDIDO RECIBIDO</span>

            <h2>¡Gracias por tu compra!</h2>

            <p>
                Tu pedido fue registrado correctamente.
            </p>

            ${data?.order_code ? `
                <div class="order-code">
                    <span>Número de pedido</span>
                    <strong>${escapeHtml(data.order_code)}</strong>
                </div>
            ` : ''}

            ${data?.total !== undefined ? `
                <div class="order-total">
                    Total: <strong>${formatPrice(data.total)}</strong>
                </div>
            ` : ''}

            <a
                href="catalog.php"
                class="btn btn-primary"
            >
                Seguir comprando
            </a>
        </div>
    `;
}

function openOrderSuccessModal(data) {
    const modal = document.getElementById('order-success-modal');

    if (!modal) {
        return;
    }

    const codeBox = document.getElementById('order-modal-code');
    const codeValue = document.getElementById('order-modal-code-value');

    if (data?.order_code) {
        codeValue.textContent = data.order_code;
        codeBox.hidden = false;
    } else {
        codeBox.hidden = true;
    }

    modal.hidden = false;
    document.body.classList.add('order-modal-open');
}
