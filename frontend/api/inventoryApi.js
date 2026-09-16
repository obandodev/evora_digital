import { GlamAPI } from './api.js';

export const InventoryAPI = {
    movements(productId = null) {
        const query = productId ? `?product_id=${encodeURIComponent(productId)}` : '';
        return GlamAPI.get(`/inventory/movements${query}`);
    },

    adjust(data) {
        return GlamAPI.post('/inventory/adjust', data);
    }
};
