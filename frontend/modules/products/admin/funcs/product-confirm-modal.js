let modal=null;
let title=null;
let message=null;
let eyebrow=null;
let icon=null;
let cancelButton=null;
let confirmButton=null;
let resolver=null;

export function initProductConfirmModal(){
    modal=document.getElementById('product-confirm-modal');
    title=document.getElementById('product-confirm-title');
    message=document.getElementById('product-confirm-message');
    eyebrow=document.getElementById('product-confirm-eyebrow');
    icon=document.getElementById('product-confirm-icon');
    cancelButton=document.getElementById('product-confirm-cancel');
    confirmButton=document.getElementById('product-confirm-submit');

    if(!modal)return;

    cancelButton?.addEventListener('click',()=>close(false));
    document.querySelector('[data-confirm-close]')?.addEventListener('click',()=>close(false));
    confirmButton?.addEventListener('click',()=>close(true));

    document.addEventListener('keydown',event=>{
        if(event.key==='Escape'&&!modal.hidden){
            close(false);
        }
    });
}

export function openProductConfirmModal({
    titleText='¿Estás seguro?',
    messageText='Esta acción no se puede deshacer.',
    confirmText='Confirmar',
    eyebrowText='Confirmación',
    danger=false
}={}){
    if(!modal){
        return Promise.resolve(false);
    }

    title.textContent=titleText;
    message.textContent=messageText;
    confirmButton.textContent=confirmText;
    eyebrow.textContent=eyebrowText;

    icon.textContent=danger?'!':'?';
    confirmButton.classList.toggle('danger',danger);

    modal.hidden=false;
    document.body.classList.add('product-confirm-open');

    setTimeout(()=>{
        confirmButton?.focus();
    },0);

    return new Promise(resolve=>{
        resolver=resolve;
    });
}

function close(result){
    if(!modal)return;

    modal.hidden=true;
    document.body.classList.remove('product-confirm-open');

    if(resolver){
        const resolve=resolver;
        resolver=null;
        resolve(result);
    }
}