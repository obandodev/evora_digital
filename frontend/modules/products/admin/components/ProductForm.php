<div
    class="product-modal"
    id="product-modal"
    hidden
>
    <div class="product-modal-dialog">
        <div class="product-modal-header">
            <div>
                <span class="admin-page-eyebrow">Catálogo</span>
                <h2 id="product-modal-title">Nuevo producto</h2>
            </div>

            <button
                type="button"
                class="product-modal-close"
                id="btn-close-product-modal"
                aria-label="Cerrar"
            >
                ×
            </button>
        </div>

        <form id="product-form" enctype="multipart/form-data">
            <input
                type="hidden"
                id="product-id"
                name="id"
            >

            <div class="product-form-grid">
                <div class="product-form-field">
                    <label for="product-name">Nombre</label>
                    <input
                        type="text"
                        id="product-name"
                        name="name"
                        required
                    >
                </div>

                <div class="product-form-field">
                    <label for="product-category">Categoría</label>
                    <select
                        id="product-category"
                        name="category_id"
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                    </select>
                </div>

                <div class="product-form-field">
                    <label for="product-brand">Marca</label>
                    <input
                        type="text"
                        id="product-brand"
                        name="brand"
                    >
                </div>

                <div class="product-form-field">
                    <label for="product-price">Precio</label>
                    <input
                        type="number"
                        id="product-price"
                        name="price"
                        min="0"
                        required
                    >
                </div>

                <div class="product-form-field">
                    <label for="product-stock">Stock inicial</label>
                    <input
                        type="number"
                        id="product-stock"
                        name="stock"
                        min="0"
                        required
                    >
                    <small class="product-form-hint" id="product-stock-hint">
                        Cantidad con la que se crea el producto.
                    </small>
                </div>

                <div class="product-form-field">
                    <label for="product-color">Color</label>
                    <input
                        type="text"
                        id="product-color"
                        name="color"
                    >
                </div>

                <div class="product-form-field">
                    <label for="product-status">Estado</label>
                    <select
                        id="product-status"
                        name="status"
                    >
                        <option value="ACTIVE">Activo</option>
                        <option value="INACTIVE">Inactivo</option>
                    </select>
                </div>

                <div class="product-form-field product-form-field-full">
                    <label for="product-description">Descripción</label>
                    <textarea
                        id="product-description"
                        name="description"
                        rows="4"
                    ></textarea>
                </div>

                <div class="product-form-field product-form-field-full">
                    <label for="product-image">Imagen</label>

                    <input
                        type="file"
                        id="product-image"
                        name="image"
                        accept="image/jpeg,image/png,image/webp"
                    >

                    <div
                        class="product-image-preview"
                        id="product-image-preview"
                        hidden
                    >
                        <img
                            id="product-preview-image"
                            src=""
                            alt="Vista previa"
                        >

                        <button
                            type="button"
                            id="btn-remove-preview"
                        >
                            Quitar imagen
                        </button>
                    </div>
                </div>
            </div>

            <div
                class="product-form-message"
                id="product-modal-message"
                hidden
            ></div>

            <div class="product-modal-actions">
                <button
                    type="button"
                    class="admin-button admin-button-secondary"
                    id="btn-cancel-product"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="admin-button admin-button-primary"
                    id="btn-save-product"
                >
                    Guardar producto
                </button>
            </div>
        </form>
    </div>
</div>
