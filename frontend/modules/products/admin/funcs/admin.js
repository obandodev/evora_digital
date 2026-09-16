import { ProductAPI } from '../../../../api/productApi.js';
import { CategoryAPI } from '../../../../api/categoryApi.js';

import {
    initProductFilters,
    getProductFilters
} from './product-filters.js';

import {
    initProductTable,
    renderProducts,
    updateProductSummary
} from './product-table.js';

import { initProductForm } from './product-form.js';
import { showProductMessage } from './product-ui.js';
import {
    initProductConfirmModal,
    openProductConfirmModal
} from './product-confirm-modal.js';

const state={
    products:[],
    categories:[]
};

document.addEventListener('DOMContentLoaded',initProducts);

async function initProducts(){
    initProductConfirmModal();

    initProductFilters({
        onChange:loadProducts
    });

    initProductTable({
        onEdit:handleEdit,
        onToggle:handleToggle,
        onDelete:handleDelete
    });

    initProductForm({
        getCategories:()=>state.categories,
        onSaved:loadProducts
    });

    await loadCategories();
    await loadProducts();
}

async function loadCategories(){
    try{
        const response=await CategoryAPI.adminList();

        state.categories=normalizeArray(response.data);

        renderCategoryFilter(state.categories);

        document.dispatchEvent(
            new CustomEvent(
                'products:categories-loaded',
                {
                    detail:state.categories
                }
            )
        );
    }catch(error){
        console.error(
            'Error cargando categorías:',
            error
        );

        state.categories=[];

        renderCategoryFilter([]);

        showProductMessage(
            error.message ||
            'No fue posible cargar las categorías.'
        );
    }
}

async function loadProducts(){
    try{
        const response=await ProductAPI.adminList(
            getProductFilters()
        );

        state.products=normalizeProducts(
            response.data
        );

        renderProducts(state.products);
        updateProductSummary(state.products);
    }catch(error){
        console.error(
            'Error cargando productos:',
            error
        );

        state.products=[];

        renderProducts([]);
        updateProductSummary([]);

        showProductMessage(
            error.message ||
            'No fue posible cargar los productos.'
        );
    }
}

function handleEdit(product){
    document.dispatchEvent(
        new CustomEvent(
            'products:edit',
            {
                detail:product
            }
        )
    );
}

async function handleToggle(product){
    const isActive=String(
        product.status || ''
    ).toUpperCase()==='ACTIVE';

    const newStatus=isActive
        ?'INACTIVE'
        :'ACTIVE';

    const confirmed=await openProductConfirmModal({
        titleText:isActive
            ?'¿Desactivar producto?'
            :'¿Activar producto?',
        messageText:isActive
            ?`El producto "${product.name}" dejará de estar disponible en el catálogo.`
            :`El producto "${product.name}" volverá a estar disponible en el catálogo.`,
        confirmText:isActive
            ?'Desactivar'
            :'Activar',
        eyebrowText:isActive
            ?'Desactivar'
            :'Activar',
        danger:isActive
    });

    if(!confirmed)return;

    try{
        const formData=new FormData();

        formData.append(
            'category_id',
            product.category_id || ''
        );

        formData.append(
            'brand',
            product.brand || ''
        );

        formData.append(
            'name',
            product.name || ''
        );

        formData.append(
            'description',
            product.description || ''
        );

        formData.append(
            'price',
            product.price || ''
        );

        formData.append(
            'color',
            product.color || ''
        );

        formData.append(
            'status',
            newStatus
        );

        formData.append(
            'stock',
            product.stock || 0
        );

        await ProductAPI.update(
            product.id,
            formData
        );

        showProductMessage(
            isActive
                ?'Producto desactivado correctamente.'
                :'Producto activado correctamente.'
        );

        await loadProducts();
    }catch(error){
        showProductMessage(
            error.message ||
            'No fue posible actualizar el estado del producto.'
        );
    }
}

async function handleDelete(product){
    const confirmed=await openProductConfirmModal({
        titleText:'¿Eliminar producto?',
        messageText:`Vas a eliminar "${product.name}". Esta acción no se puede deshacer.`,
        confirmText:'Eliminar',
        eyebrowText:'Eliminar producto',
        danger:true
    });

    if(!confirmed)return;

    try{
        await ProductAPI.remove(
            product.id
        );

        showProductMessage(
            'Producto eliminado correctamente.'
        );

        await loadProducts();
    }catch(error){
        showProductMessage(
            error.message ||
            'No fue posible eliminar el producto.'
        );
    }
}

function renderCategoryFilter(categories){
    const select=document.getElementById(
        'product-category-filter'
    );

    if(!select)return;

    const currentValue=select.value;

    select.innerHTML=`
        <option value="">Todas las categorías</option>
        ${categories.map(category=>`
            <option value="${escapeHtml(category.id)}">
                ${escapeHtml(category.name)}
            </option>
        `).join('')}
    `;

    if(
        currentValue &&
        categories.some(
            category=>String(category.id)===String(currentValue)
        )
    ){
        select.value=currentValue;
    }
}

function normalizeProducts(data){
    if(Array.isArray(data)){
        return data;
    }

    if(Array.isArray(data?.items)){
        return data.items;
    }

    if(Array.isArray(data?.products)){
        return data.products;
    }

    return [];
}

function normalizeArray(data){
    if(Array.isArray(data)){
        return data;
    }

    if(Array.isArray(data?.items)){
        return data.items;
    }

    if(Array.isArray(data?.categories)){
        return data.categories;
    }

    return [];
}

function escapeHtml(value){
    return String(value ?? '')
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');
}