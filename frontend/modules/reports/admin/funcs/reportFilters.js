import { getPeriodDates } from './reportPeriods.js';
import { setReportDates } from './reportState.js';

export function initReportFilters(onApply) {
    const period = document.getElementById('report-period');
    const customFields = document.querySelectorAll('.report-custom-date');
    const applyButton = document.getElementById('report-apply');

    function toggleCustomDates() {
        customFields.forEach(element => {
            element.classList.toggle(
                'is-hidden',
                period.value !== 'custom'
            );
        });
    }

    function applyFilters() {
        const dates = getPeriodDates(
            period.value,
            document.getElementById('report-from').value,
            document.getElementById('report-to').value
        );

        setReportDates(dates.from, dates.to);
        onApply(dates);
    }

    period.addEventListener('change', toggleCustomDates);
    applyButton.addEventListener('click', applyFilters);

    toggleCustomDates();

    return applyFilters;
}

export function validateReportDates({ from, to }) {
    return !from || !to || from <= to;
}