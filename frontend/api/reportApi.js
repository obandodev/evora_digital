import { GlamAPI } from './api.js';

function buildQuery(filters = {}) {
    const params = new URLSearchParams();

    if(filters.from){
        params.set('from',filters.from);
    }

    if(filters.to){
        params.set('to',filters.to);
    }

    const query=params.toString();

    return query
        ?`?${query}`
        :'';
}

export const ReportAPI = {
    summary(filters={}){
        return GlamAPI.get(
            `/admin/reports/summary${buildQuery(filters)}`
        );
    },

    inventory(){
        return GlamAPI.get(
            '/admin/reports/inventory'
        );
    },

    inventoryCategories(){
        return GlamAPI.get(
            '/admin/reports/inventory/categories'
        );
    },

    salesCategories(filters={}){
        return GlamAPI.get(
            `/admin/reports/sales/categories${buildQuery(filters)}`
        );
    },

    salesProducts(filters={}){
        return GlamAPI.get(
            `/admin/reports/sales/products${buildQuery(filters)}`
        );
    }
};