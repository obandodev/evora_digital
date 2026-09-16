const pad = value =>
    String(value).padStart(2, '0');

const formatDate = date =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export function getPeriodDates(period, from = '', to = '') {
    const today = new Date();
    const end = formatDate(today);

    if (period === 'custom') {
        return { from, to };
    }

    if (period === 'today') {
        return {
            from: end,
            to: end
        };
    }

    if (period === 'week') {
        const start = new Date(today);
        const day = start.getDay() || 7;

        start.setDate(start.getDate() - day + 1);

        return {
            from: formatDate(start),
            to: end
        };
    }

    if (period === 'month') {
        return {
            from: `${today.getFullYear()}-${pad(today.getMonth() + 1)}-01`,
            to: end
        };
    }

    if (period === 'year') {
        return {
            from: `${today.getFullYear()}-01-01`,
            to: end
        };
    }

    return {
        from: '',
        to: ''
    };
}