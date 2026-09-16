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

export function updateCartCount(){
    const count=getCartCount();

    const counter=document.getElementById(
        'cart-count'
    );

    const mobileCounter=document.getElementById(
        'mobile-cart-count'
    );

    if(counter){
        counter.textContent=count;
    }

    if(mobileCounter){
        mobileCounter.textContent=count;
    }
}

export function formatPrice(value){
    return new Intl.NumberFormat(
        'es-CO',
        {
            style:'currency',
            currency:'COP',
            maximumFractionDigits:0
        }
    ).format(Number(value)||0);
}

export function showStockModal(
    available,
    requested=null
){
    const modal=document.getElementById(
        'stock-modal'
    );

    if(!modal){
        return;
    }

    const availableElement=
        document.getElementById(
            'stock-modal-available'
        );

    const message=
        document.getElementById(
            'stock-modal-message'
        );

    if(availableElement){
        availableElement.textContent=
            Number(available);
    }

    if(message){
        if(requested!==null){
            message.textContent=
                `Seleccionaste ${Number(requested)} unidades, pero actualmente solo tenemos ${Number(available)} disponibles.`;
        }else{
            message.textContent=
                `La cantidad seleccionada supera las unidades disponibles. Actualmente solo tenemos ${Number(available)} disponibles.`;
        }
    }

    modal.hidden=false;

    document.body.classList.add(
        'stock-modal-open'
    );
}

export function closeStockModal(){
    const modal=document.getElementById(
        'stock-modal'
    );

    if(!modal){
        return;
    }

    modal.hidden=true;

    document.body.classList.remove(
        'stock-modal-open'
    );
}

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

        const menuToggle=
            document.getElementById(
                'menu-toggle'
            );

        const mobileMenu=
            document.getElementById(
                'mobile-menu'
            );

        const mobileMenuClose=
            document.getElementById(
                'mobile-menu-close'
            );

        const overlay=
            document.getElementById(
                'mobile-menu-overlay'
            );

        function openMenu(){
            if(!mobileMenu)return;

            mobileMenu.classList.add(
                'open'
            );

            menuToggle?.classList.add(
                'active'
            );

            menuToggle?.setAttribute(
                'aria-expanded',
                'true'
            );

            mobileMenu.setAttribute(
                'aria-hidden',
                'false'
            );

            if(overlay){
                overlay.hidden=false;
            }

            document.body.classList.add(
                'mobile-menu-open'
            );
        }

        function closeMenu(){
            if(!mobileMenu)return;

            mobileMenu.classList.remove(
                'open'
            );

            menuToggle?.classList.remove(
                'active'
            );

            menuToggle?.setAttribute(
                'aria-expanded',
                'false'
            );

            mobileMenu.setAttribute(
                'aria-hidden',
                'true'
            );

            if(overlay){
                overlay.hidden=true;
            }

            document.body.classList.remove(
                'mobile-menu-open'
            );
        }

        menuToggle?.addEventListener(
            'click',
            ()=>{
                mobileMenu?.classList.contains(
                    'open'
                )
                    ?closeMenu()
                    :openMenu();
            }
        );

        mobileMenuClose?.addEventListener(
            'click',
            closeMenu
        );

        overlay?.addEventListener(
            'click',
            closeMenu
        );

        mobileMenu
            ?.querySelectorAll('a')
            .forEach(link=>{
                link.addEventListener(
                    'click',
                    closeMenu
                );
            });
    }
);