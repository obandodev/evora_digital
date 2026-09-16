import {
    getCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    formatPrice,
    showStockModal
} from './cart.js';

import { ProductAPI } from '../api/productApi.js';

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

    setupEvents();
}

async function refreshCartStock(){
    const cart=getCart();

    const updated=await Promise.all(
        cart.map(
            async item=>{
                try{
                    const response=
                        await ProductAPI.get(
                            item.id
                        );

                    const product=
                        response.data;

                    item.stock=
                        Number(
                            product.stock
                        )||0;

                    item.price=
                        Number(
                            product.price
                        );

                    item.name=
                        product.name||
                        item.name;

                    if(
                        item.quantity>
                        item.stock
                    ){
                        item.quantity=
                            item.stock;
                    }

                    return item;

                }catch{
                    return item;
                }
            }
        )
    );

    const validCart=
        updated.filter(
            item=>Number(item.stock)>0
        );

    localStorage.setItem(
        'glam_beauty_cart',
        JSON.stringify(validCart)
    );

    return validCart;
}

function renderCartItem(item){
    const image=item.image
        ?`/glam-beauty/backend/uploads/products/${item.image}`
        :'';

    const subtotal=
        Number(item.price)*
        Number(item.quantity);

    const stock=
        Number(item.stock)||0;

    return`
        <article class="cart-item">

            <a
                href="product.php?id=${item.id}"
                class="cart-item-image"
            >
                ${
                    image
                        ?`
                            <img
                                src="${image}"
                                alt="${escapeHtml(item.name)}"
                            >
                        `
                        :`
                            <div class="product-no-image">
                                Glam Beauty
                            </div>
                        `
                }
            </a>

            <div class="cart-item-info">

                <span class="product-brand">
                    ${escapeHtml(
                        item.brand||
                        'Glam Beauty'
                    )}
                </span>

                <h2>
                    ${escapeHtml(item.name)}
                </h2>

                ${
                    item.color
                        ?`
                            <span class="cart-item-color">
                                ${escapeHtml(
                                    item.color
                                )}
                            </span>
                        `
                        :''
                }

                <strong class="cart-item-price">
                    ${formatPrice(item.price)}
                </strong>

            </div>

            <div class="cart-item-quantity">

                <label
                    for="quantity-${item.id}"
                >
                    Cantidad
                </label>

                <input
                    id="quantity-${item.id}"
                    class="quantity-input"
                    type="number"
                    min="1"
                    max="${stock}"
                    value="${item.quantity}"
                    data-id="${item.id}"
                >

                <small class="cart-stock">
                    ${stock} disponibles
                </small>

            </div>

            <div class="cart-item-subtotal">

                <strong>
                    ${formatPrice(subtotal)}
                </strong>

                <button
                    type="button"
                    class="remove-item"
                    data-id="${item.id}"
                >
                    Eliminar
                </button>

            </div>

        </article>
    `;
}

function setupEvents(){
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

function renderEmptyCart(
    container
){
    container.innerHTML=`
        <div class="empty-cart">

            <span class="empty-cart-number">
                00
            </span>

            <h2>
                Tu carrito está vacío
            </h2>

            <p>
                Todavía no has agregado productos a tu carrito.
            </p>

            <a
                href="catalog.php"
                class="btn btn-primary"
            >
                Explorar catálogo
            </a>

        </div>
    `;
}

function escapeHtml(value){
    return String(value??'')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll(
            "'",
            '&#039;'
        );
}