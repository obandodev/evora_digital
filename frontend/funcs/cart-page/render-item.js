import { formatPrice } from '../cart.js';

export function renderCartItem(item){
    const image=item.image
        ?`${window.GLAM.IMAGE_URL}/${item.image}`
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

export function renderEmptyCart(
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

export function escapeHtml(value){
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
