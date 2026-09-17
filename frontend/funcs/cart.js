export {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal
} from './cart/storage.js';

export {
    updateCartCount,
    formatPrice,
    showStockModal,
    closeStockModal
} from './cart/ui.js';

import { updateCartCount, closeStockModal } from './cart/ui.js';
import { initMobileMenu } from './cart/mobile-menu.js';

document.addEventListener(
    'DOMContentLoaded',
    ()=>{
        updateCartCount();

        document
            .querySelectorAll(
                '[data-close-stock-modal]'
            )
            .forEach(element=>{
                element.addEventListener(
                    'click',
                    closeStockModal
                );
            });

        document.addEventListener(
            'keydown',
            event=>{
                if(
                    event.key==='Escape'
                ){
                    closeStockModal();
                }
            }
        );

        initMobileMenu();
    }
);
