import { ProductAPI } from '../api/productApi.js';

import {
    addToCart,
    updateCartCount,
    formatPrice,
    showStockModal
} from './cart.js';

document.addEventListener(
    'DOMContentLoaded',
    async ()=>{
        const container=
            document.getElementById(
                'product-detail'
            );

        if(!container){
            return;
        }

        const params=
            new URLSearchParams(
                window.location.search
            );

        const id=params.get('id');

        if(!id){
            showError(
                container,
                'Producto no encontrado.'
            );

            return;
        }

        try{
            const response=
                await ProductAPI.get(id);

            const product=response.data;

            if(!product){
                showError(
                    container,
                    'Producto no encontrado.'
                );

                return;
            }

            renderProduct(
                container,
                product
            );

            setupCart(product);

        }catch(error){
            console.error(error);

            showError(
                container,
                error.message
            );
        }
    }
);

function renderProduct(
    container,
    product
){
    const images=
        product.images||[];

    const primaryImagePath=
        product.main_image||
        images.find(
            image=>
                Number(image.is_primary)===1
        )?.image_path||
        images[0]?.image_path||
        '';

    product.main_image=
        primaryImagePath;

    const mainImage=
        primaryImagePath
            ?`/glam-beauty/backend/uploads/products/${primaryImagePath}`
            :'';

    const stock=
        Number(product.stock)||0;

    container.innerHTML=`
        <div class="product-gallery">
            <div class="product-main-image">
                ${
                    mainImage
                        ?`
                            <img
                                id="main-product-image"
                                src="${mainImage}"
                                alt="${escapeHtml(product.name)}"
                            >
                        `
                        :`
                            <div class="product-no-image">
                                Glam Beauty
                            </div>
                        `
                }
            </div>

            ${
                images.length>1
                    ?`
                        <div class="product-thumbnails">
                            ${
                                images.map(
                                    image=>`
                                        <button
                                            type="button"
                                            class="product-thumbnail"
                                            data-image="/glam-beauty/backend/uploads/products/${image.image_path}"
                                        >
                                            <img
                                                src="/glam-beauty/backend/uploads/products/${image.image_path}"
                                                alt="${escapeHtml(product.name)}"
                                            >
                                        </button>
                                    `
                                ).join('')
                            }
                        </div>
                    `
                    :''
            }
        </div>

        <div class="product-information">

            <span class="product-brand">
                ${escapeHtml(
                    product.brand||
                    'Glam Beauty'
                )}
            </span>

            <h1>
                ${escapeHtml(
                    product.name
                )}
            </h1>

            <p class="product-category">
                ${escapeHtml(
                    product.category_name||
                    ''
                )}
            </p>

            <strong class="product-price">
                ${formatPrice(
                    product.price
                )}
            </strong>

            ${
                product.description
                    ?`
                        <p class="product-description">
                            ${escapeHtml(
                                product.description
                            )}
                        </p>
                    `
                    :''
            }

            ${
                product.color
                    ?`
                        <p class="product-color">
                            <strong>Color:</strong>
                            ${escapeHtml(
                                product.color
                            )}
                        </p>
                    `
                    :''
            }

            <p class="product-stock ${
                stock>0
                    ?'available'
                    :'sold-out'
            }">
                ${
                    stock>0
                        ?`${stock} disponibles`
                        :'Agotado'
                }
            </p>

            ${
                stock>0
                    ?`
                        <div class="product-purchase">

                            <label
                                for="product-quantity"
                            >
                                Cantidad
                            </label>

                            <input
                                id="product-quantity"
                                type="number"
                                min="1"
                                max="${stock}"
                                value="1"
                            >

                            <button
                                type="button"
                                id="add-to-cart"
                            >
                                Agregar a la bolsa
                            </button>

                        </div>
                    `
                    :''
            }

        </div>
    `;

    container
        .querySelectorAll(
            '.product-thumbnail'
        )
        .forEach(button=>{
            button.addEventListener(
                'click',
                ()=>{
                    const image=
                        document.getElementById(
                            'main-product-image'
                        );

                    if(image){
                        image.src=
                            button.dataset.image;
                    }
                }
            );
        });
}

function setupCart(product){
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

function showError(
    container,
    message
){
    container.innerHTML=`
        <div class="product-error">

            <h2>Ups...</h2>

            <p>
                ${escapeHtml(
                    message||
                    'No fue posible cargar el producto.'
                )}
            </p>

            <a href="catalog.php">
                Volver al catálogo
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