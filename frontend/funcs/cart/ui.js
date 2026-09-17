import { getCartCount } from './storage.js';

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
