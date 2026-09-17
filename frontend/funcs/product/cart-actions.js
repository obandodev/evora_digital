import {
    addToCart,
    updateCartCount,
    showStockModal
} from '../cart.js';

export function setupCart(product){
    const button=
        document.getElementById(
            'add-to-cart'
        );

    const quantityInput=
        document.getElementById(
            'product-quantity'
        );

    if(!button||!quantityInput){
        return;
    }

    const stock=
        Number(product.stock)||0;

    quantityInput.addEventListener(
        'change',
        ()=>{
            const quantity=
                Number(
                    quantityInput.value
                );

            if(quantity>stock){
                showStockModal(
                    stock,
                    quantity
                );

                quantityInput.value=
                    stock;

                return;
            }

            if(quantity<1){
                quantityInput.value=1;
            }
        }
    );

    button.addEventListener(
        'click',
        ()=>{
            const quantity=
                Number(
                    quantityInput.value||1
                );

            if(quantity<1){
                quantityInput.value=1;
                return;
            }

            if(quantity>stock){
                showStockModal(
                    stock,
                    quantity
                );

                quantityInput.value=
                    stock;

                return;
            }

            const result=
                addToCart(
                    product,
                    quantity
                );

            if(!result.success){
                showStockModal(
                    result.available,
                    result.requested
                );

                quantityInput.value=
                    result.available;

                return;
            }

            updateCartCount();

            button.textContent=
                'Agregado a la bolsa';

            button.disabled=true;

            setTimeout(
                ()=>{
                    button.textContent=
                        'Agregar a la bolsa';

                    button.disabled=false;
                },
                1500
            );
        }
    );
}
