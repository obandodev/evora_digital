import { GlamAPI } from './api.js';

export const CategoryAPI = {
    list() {
        return GlamAPI.get('/categories');
    },

    adminList() {
        return GlamAPI.get('/admin/categories');
    },

    get(id) {
        return GlamAPI.get(`/categories/${id}`);
    },

    create(data) {
        return GlamAPI.post('/categories', data);
    },

    update(id, data) {
        return GlamAPI.put(`/categories/${id}`, data);
    },

    remove(id) {
        return GlamAPI.delete(`/categories/${id}`);
    }
};