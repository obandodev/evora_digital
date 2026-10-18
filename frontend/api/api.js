const API_BASE = window.GLAM.API_URL;

async function request(path, options = {}) {
    const config = {
        credentials: 'include',
        ...options,
        headers: {
            ...(options.body instanceof FormData
                ? {}
                : { 'Content-Type': 'application/json' }),
            ...(options.headers || {})
        }
    };

    const response = await fetch(`${API_BASE}${path}`, config);
    const text = await response.text();

    let data;

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error('La API devolvió una respuesta no válida.');
    }

    if (!response.ok || data.success === false) {
        throw new Error(data.message || 'No fue posible completar la solicitud.');
    }

    return data;
}

export const GlamAPI = {
    get(path) {
        return request(path);
    },

    post(path, body) {
        return request(path, {
            method: 'POST',
            body: body instanceof FormData
                ? body
                : JSON.stringify(body)
        });
    },

    put(path, body) {
        return request(path, {
            method: 'PUT',
            body: body instanceof FormData
                ? body
                : JSON.stringify(body)
        });
    },

    delete(path) {
        return request(path, {
            method: 'DELETE'
        });
    }
};