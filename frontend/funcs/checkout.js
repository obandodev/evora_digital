import {
    getCart,
    getCartTotal,
    clearCart,
    formatPrice
} from './cart.js';

import { OrderAPI } from '../api/orderApi.js';

document.addEventListener('DOMContentLoaded', renderCheckout);

function renderCheckout() {
    const container = document.getElementById('checkout-container');

    if (!container) {
        return;
    }

    const cart = getCart();

    if (!cart.length) {
        renderEmptyCheckout(container);
        return;
    }

    container.innerHTML = `
        <div class="checkout-layout">
            <form id="checkout-form" class="checkout-form">
                <div class="checkout-form-heading">
                    <span class="eyebrow">01 — DATOS</span>
                    <h2>Información de entrega</h2>
                </div>

                <div class="form-grid">
                    <div class="form-group form-group-full">
                        <label for="customer-name">
                            Nombre completo *
                        </label>

                        <input
                            type="text"
                            id="customer-name"
                            name="customer_name"
                            required
                            autocomplete="name"
                            placeholder="Tu nombre completo"
                        >
                    </div>

                    <div class="form-group">
                        <label for="customer-phone">
                            Teléfono *
                        </label>

                        <input
                            type="tel"
                            id="customer-phone"
                            name="customer_phone"
                            required
                            autocomplete="tel"
                            placeholder="300 000 0000"
                        >
                    </div>

                    <div class="form-group">
                        <label for="customer-email">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            id="customer-email"
                            name="customer_email"
                            autocomplete="email"
                            placeholder="correo@ejemplo.com"
                        >
                    </div>

                    <div class="form-group">
                        <label for="delivery-city">
                            Ciudad
                        </label>

                        <input
                            type="text"
                            id="delivery-city"
                            name="delivery_city"
                            placeholder="Ciudad"
                        >
                    </div>

                    <div class="form-group">
                        <label for="delivery-address">
                            Dirección *
                        </label>

                        <input
                            type="text"
                            id="delivery-address"
                            name="delivery_address"
                            required
                            autocomplete="street-address"
                            placeholder="Calle, carrera, número..."
                        >
                    </div>

                    <div class="form-group form-group-full">
                        <label for="order-notes">
                            Notas del pedido
                        </label>

                        <textarea
                            id="order-notes"
                            name="notes"
                            rows="4"
                            placeholder="Indicaciones adicionales para tu pedido..."
                        ></textarea>
                    </div>
                </div>

                <div
                    id="checkout-message"
                    class="checkout-message"
                    hidden
                ></div>

                <button
                    type="submit"
                    class="btn btn-primary checkout-submit"
                >
                    Confirmar pedido
                </button>
            </form>

            <aside class="checkout-summary">
                <span class="summary-label">02 — TU PEDIDO</span>

                <div class="checkout-products">
                    ${cart.map(renderCheckoutItem).join('')}
                </div>

                <div class="checkout-total">
                    <span>Total</span>
                    <strong>${formatPrice(getCartTotal())}</strong>
                </div>
            </aside>
        </div>
    `;

    document
        .getElementById('checkout-form')
        ?.addEventListener('submit', submitOrder);
}

function renderCheckoutItem(item) {
    const image = item.image
        ? `/glam-beauty/backend/uploads/products/${item.image}`
        : '';

    const subtotal = Number(item.price) * Number(item.quantity);

    return `
        <div class="checkout-product">
            <div class="checkout-product-image">
                ${image
                    ? `<img
                        src="${image}"
                        alt="${escapeHtml(item.name)}"
                    >`
                    : '<div class="product-no-image">G</div>'
                }
            </div>

            <div class="checkout-product-info">
                <strong>${escapeHtml(item.name)}</strong>

                <span>
                    ${item.quantity} × ${formatPrice(item.price)}
                </span>
            </div>

            <strong class="checkout-product-total">
                ${formatPrice(subtotal)}
            </strong>
        </div>
    `;
}

async function submitOrder(event) {
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

function renderEmptyCheckout(container) {
    container.innerHTML = `
        <div class="empty-checkout">
            <span class="empty-checkout-number">00</span>

            <h2>No hay productos para comprar</h2>

            <p>
                Agrega algunos productos a tu bolsa antes de continuar.
            </p>

            <a
                href="catalog.php"
                class="btn btn-primary"
            >
                Ir al catálogo
            </a>
        </div>
    `;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}