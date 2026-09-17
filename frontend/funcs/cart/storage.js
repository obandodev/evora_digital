import { updateCartCount } from './ui.js';

const CART_KEY = 'glam_beauty_cart';

export function getCart(){
    try{
        const cart=JSON.parse(
            localStorage.getItem(CART_KEY)
        );

        return Array.isArray(cart)?cart:[];
    }catch{
        return [];
    }
}

export function saveCart(cart){
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}

export function addToCart(product, quantity=1){
    const cart=getCart();

    const productId=Number(product.id);
    const selectedQuantity=Number(quantity);
    const availableStock=Number(product.stock)||0;

    const existing=cart.find(
        item=>Number(item.id)===productId
    );

    const currentQuantity=existing
        ? Number(existing.quantity)
        : 0;

    const finalQuantity=
        currentQuantity+selectedQuantity;

    if(
        availableStock>0 &&
        finalQuantity>availableStock
    ){
        return {
            success:false,
            available:availableStock,
            requested:finalQuantity,
            cart
        };
    }

    if(existing){
        existing.quantity=finalQuantity;
        existing.stock=availableStock;
    }else{
        cart.push({
            id:productId,
            name:product.name,
            brand:product.brand||'',
            price:Number(product.price),
            color:product.color||'',
            image:product.main_image||'',
            quantity:selectedQuantity,
            stock:availableStock
        });
    }

    saveCart(cart);

    return {
        success:true,
        cart
    };
}

export function removeFromCart(productId){
    const cart=getCart().filter(
        item=>Number(item.id)!==Number(productId)
    );

    saveCart(cart);

    return cart;
}

export function updateQuantity(productId,quantity){
    const cart=getCart();

    const item=cart.find(
        item=>Number(item.id)===Number(productId)
    );

    if(!item){
        return {
            success:false,
            cart
        };
    }

    const newQuantity=Number(quantity);
    const availableStock=Number(item.stock)||0;

    if(newQuantity<=0){
        return {
            success:true,
            cart:removeFromCart(productId)
        };
    }

    if(
        availableStock>0 &&
        newQuantity>availableStock
    ){
        return {
            success:false,
            available:availableStock,
            requested:newQuantity,
            cart
        };
    }

    item.quantity=newQuantity;

    saveCart(cart);

    return {
        success:true,
        cart
    };
}

export function clearCart(){
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

export function getCartCount(){
    return getCart().reduce(
        (total,item)=>
            total+Number(item.quantity),
        0
    );
}

export function getCartTotal(){
    return getCart().reduce(
        (total,item)=>
            total+
            Number(item.price)*
            Number(item.quantity),
        0
    );
}
