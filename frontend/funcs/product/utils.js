export function showError(
    container,
    message
){
    container.innerHTML=`
        <div class="product-error">

            <h2>Ups...</h2>

            <p>
                ${escapeHtml(
                    message||
                    'No fue posible cargar el producto.'
                )}
            </p>

            <a href="catalog.php">
                Volver al catálogo
            </a>

        </div>
    `;
}

export function escapeHtml(value){
    return String(value??'')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll(
            "'",
            '&#039;'
        );
}
