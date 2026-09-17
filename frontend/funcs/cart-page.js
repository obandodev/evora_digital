import {
    getCart,
    getCartTotal,
    formatPrice
} from './cart.js';

import { refreshCartStock } from './cart-page/stock-sync.js';
import { renderCartItem, renderEmptyCart } from './cart-page/render-item.js';
import { setupEvents } from './cart-page/events.js';

document.addEventListener(
    'DOMContentLoaded',
    renderCart
);

async function renderCart(){
    const container=
        document.getElementById(
            'cart-container'
        );

    if(!container){
        return;
    }

    let cart=getCart();

    if(!cart.length){
        renderEmptyCart(container);
        return;
    }

    container.innerHTML=
        '<p class="loading-message">Verificando disponibilidad...</p>';

    try{
        cart=await refreshCartStock();
    }catch(error){
        console.error(
            'No fue posible verificar el stock:',
            error
        );
    }

    if(!cart.length){
        renderEmptyCart(container);
        return;
    }

    container.innerHTML=`
        <div class="cart-layout">

            <div class="cart-items">

                ${cart.map(
                    renderCartItem
                ).join('')}

                <div class="cart-actions">
                    <button
                        type="button"
                        id="clear-cart"
                        class="cart-clear"
                    >
                        Vaciar bolsa
                    </button>
                </div>

            </div>

            <aside class="cart-summary">

                <span class="summary-label">
                    RESUMEN
                </span>

                <div class="summary-row">
                    <span>Productos</span>

                    <strong>
                        ${formatPrice(
                            getCartTotal()
                        )}
                    </strong>
                </div>

                <div class="summary-row summary-total">
                    <span>Total</span>

                    <strong>
                        ${formatPrice(
                            getCartTotal()
                        )}
                    </strong>
                </div>

                <a
                    href="checkout.php"
                    class="btn btn-primary checkout-button"
                >
                    Continuar pedido
                </a>

            </aside>

        </div>
    `;

    setupEvents(renderCart);
}
