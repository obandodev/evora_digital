export function formatType(type) {
    const labels = {
        ENTRY: 'Entrada',
        ADJUSTMENT: 'Ajuste',
        EXIT: 'Salida'
    };

    return labels[type] || type || '—';
}

export function formatDate(value) {
    if (!value) return '—';

    const date = new Date(value.replace(' ', 'T'));

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
