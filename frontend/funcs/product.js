import { ProductAPI } from '../api/productApi.js';

import { renderProduct } from './product/render.js';
import { setupCart } from './product/cart-actions.js';
import { showError } from './product/utils.js';

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
