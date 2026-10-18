import { formatPrice } from '../cart.js';
import { escapeHtml } from './utils.js';

export function renderProduct(
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
            ? `${window.GLAM.IMAGE_URL}/${item.image}`
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
                                            data-image="${window.GLAM.IMAGE_URL}/${image.image_path}"
                                        >
                                            <img
                                                src="${window.GLAM.IMAGE_URL}/${image.image_path}"
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
