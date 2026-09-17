export function getProductImage(product) {
    let image = '';

    if (product.image_url) {
        image = product.image_url;
    } else if (product.image) {
        image = product.image;
    } else if (product.main_image) {
        image = product.main_image;
    } else if (
        Array.isArray(product.images) &&
        product.images.length
    ) {
        const item = product.images[0];

        image = typeof item === 'string'
            ? item
            : item.url ||
              item.image_url ||
              item.path ||
              '';
    }

    if (!image) {
        return '';
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('data:') ||
        image.startsWith('/')
    ) {
        return image;
    }

    return `/glam-beauty/backend/uploads/products/${image.split('/').pop()}`;
}

export function normalizeStatus(status) {
    return String(status || '').toUpperCase();
}

export function getStockClass(stock) {
    if (stock <= 0) {
        return 'product-stock-empty';
    }

    if (stock <= 5) {
        return 'product-stock-low';
    }

    return '';
}

export function formatPrice(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(Number(value || 0));
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
