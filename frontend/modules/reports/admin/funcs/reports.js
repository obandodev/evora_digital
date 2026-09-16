import {
    initReportFilters,
    validateReportDates
} from './reportFilters.js';

import { loadReports } from './reportLoader.js';

function showError(message = '') {
    const element = document.getElementById('report-error');

    element.textContent = message;
    element.classList.toggle('is-hidden', !message);
}

async function refreshReports(dates) {
    showError('');

    if (!validateReportDates(dates)) {
        showError(
            'La fecha inicial no puede ser mayor que la fecha final.'
        );
        return;
    }

    try {
        await loadReports(dates);
    } catch (error) {
        showError(
            error.message ||
            'No fue posible cargar los reportes.'
        );
    }
}

initReportFilters(refreshReports);

refreshReports({
    from: '',
    to: ''
});