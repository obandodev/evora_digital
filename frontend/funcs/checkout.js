import { getCart } from './cart.js';

import { renderCheckoutForm } from './checkout/form-template.js';
import { renderEmptyCheckout } from './checkout/empty.js';
import { submitOrder } from './checkout/submit.js';

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

    container.innerHTML = renderCheckoutForm(cart);

    document
        .getElementById('checkout-form')
        ?.addEventListener('submit', submitOrder);
}
