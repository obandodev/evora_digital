import { getCart } from '../cart.js';
import { ProductAPI } from '../../api/productApi.js';

export async function refreshCartStock(){
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
