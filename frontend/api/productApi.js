import { GlamAPI } from './api.js';

export const ProductAPI = {
    list(params = {}) {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, value);
            }
        });

        const suffix = query.toString() ? `?${query.toString()}` : '';

        return GlamAPI.get(`/products${suffix}`);
    },

    adminList(params = {}) {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, value);
            }
        });

        const suffix = query.toString() ? `?${query.toString()}` : '';

        return GlamAPI.get(`/admin/products${suffix}`);
    },

    get(id) {
        return GlamAPI.get(`/products/${id}`);
    },

    create(formData) {
        return GlamAPI.post('/products', formData);
    },

    update(id, formData) {
        return GlamAPI.post(`/products/${id}`, formData);
    },

    remove(id) {
        return GlamAPI.delete(`/products/${id}`);
    },

    removeImage(productId, imageId) {
        return GlamAPI.delete(`/products/${productId}/images/${imageId}`);
    }
};