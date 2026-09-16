let messageTimeout = null;

export function showProductMessage(message) {
    const element =
        document.getElementById('products-message');

    if (!element) {
        return;
    }

    element.textContent = message;
    element.hidden = false;

    clearTimeout(messageTimeout);

    messageTimeout = setTimeout(() => {
        element.hidden = true;
        element.textContent = '';
    }, 3500);
}