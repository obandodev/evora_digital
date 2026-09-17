import {
    getCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    showStockModal
} from '../cart.js';

import { ProductAPI } from '../../api/productApi.js';

export function setupEvents(renderCart){
    document
        .querySelectorAll(
            '.quantity-input'
        )
        .forEach(input=>{
            input.addEventListener(
                'change',
                async ()=>{
                    const id=
                        Number(
                            input.dataset.id
                        );

                    const quantity=
                        Number(
                            input.value
                        );

                    const cart=getCart();

                    const item=
                        cart.find(
                            item=>
                                Number(item.id)===id
                        );

                    if(!item){
                        return;
                    }

                    let available=
                        Number(item.stock)||0;

                    try{
                        const response=
                            await ProductAPI.get(id);

                        const product=
                            response.data;

                        available=
                            Number(
                                product.stock
                            )||0;

                        item.stock=available;

                        localStorage.setItem(
                            'glam_beauty_cart',
                            JSON.stringify(cart)
                        );
                    }catch(error){
                        console.error(error);
                    }

                    if(quantity>available){
                        showStockModal(
                            available,
                            quantity
                        );

                        input.value=
                            Math.max(
                                available,
                                1
                            );

                        return;
                    }

                    if(quantity<1){
                        input.value=1;
                        return;
                    }

                    const result=
                        updateQuantity(
                            id,
                            quantity
                        );

                    if(!result.success){
                        showStockModal(
                            result.available,
                            result.requested
                        );

                        input.value=
                            result.available;

                        return;
                    }

                    renderCart();
                }
            );
        });

    document
        .querySelectorAll(
            '.remove-item'
        )
        .forEach(button=>{
            button.addEventListener(
                'click',
                ()=>{
                    const id=
                        Number(
                            button.dataset.id
                        );

                    removeFromCart(id);

                    renderCart();
                }
            );
        });

    document
        .getElementById(
            'clear-cart'
        )
        ?.addEventListener(
            'click',
            ()=>{
                clearCart();
                renderCart();
            }
        );
}
