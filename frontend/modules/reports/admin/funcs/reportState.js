export const reportState = {
    from: '',
    to: ''
};

export function setReportDates(from = '', to = '') {
    reportState.from = from;
    reportState.to = to;
}

export function getReportDates() {
    return { ...reportState };
}