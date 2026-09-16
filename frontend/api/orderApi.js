import { GlamAPI } from './api.js';

export const OrderAPI = {
    create(data) {
        return GlamAPI.post('/orders', data);
    },

    adminList(status = '') {
        const query = status ? `?status=${encodeURIComponent(status)}` : '';
        return GlamAPI.get(`/admin/orders${query}`);
    },

    get(id) {
        return GlamAPI.get(`/admin/orders/${id}`);
    },

    updateStatus(id, status) {
        return GlamAPI.put(`/admin/orders/${id}/status`, {
            status
        });
    }
};