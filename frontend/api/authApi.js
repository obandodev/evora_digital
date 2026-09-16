import { GlamAPI } from './api.js';

export const AuthAPI = {
    login(email, password) {
        return GlamAPI.post('/auth/login', {
            email,
            password
        });
    },

    logout() {
        return GlamAPI.post('/auth/logout', {});
    },

    me() {
        return GlamAPI.get('/auth/me');
    }
};