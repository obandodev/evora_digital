const numberFormatter = new Intl.NumberFormat('es-CO');

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
});

export const formatNumber = value =>
    numberFormatter.format(Number(value) || 0);

export const formatCurrency = value =>
    currencyFormatter.format(Number(value) || 0);

export const escapeHtml = value =>
    String(value ?? '').replace(/[&<>'"]/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;'
    }[char]));