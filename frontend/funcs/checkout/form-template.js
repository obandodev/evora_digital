import { formatPrice, getCartTotal } from '../cart.js';
import { escapeHtml } from './utils.js';

export function renderCheckoutForm(cart) {
    return `
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
