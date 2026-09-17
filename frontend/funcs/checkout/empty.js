export function renderEmptyCheckout(container) {
    container.innerHTML = `
        <div class="empty-checkout">
            <span class="empty-checkout-number">00</span>

            <h2>No hay productos para comprar</h2>

            <p>
                Agrega algunos productos a tu bolsa antes de continuar.
            </p>

            <a
                href="catalog.php"
                class="btn btn-primary"
            >
                Ir al catálogo
            </a>
        </div>
    `;
}
