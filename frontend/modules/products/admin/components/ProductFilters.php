<section class="product-filters">
    <div class="product-filter-group">
        <label for="product-search">Buscar</label>
        <input
            type="search"
            id="product-search"
            placeholder="Buscar producto..."
        >
    </div>

    <div class="product-filter-group">
        <label for="product-category-filter">Categoría</label>
        <select id="product-category-filter">
            <option value="">Todas las categorías</option>
        </select>
    </div>

    <div class="product-filter-group">
        <label for="product-status-filter">Estado</label>
        <select id="product-status-filter">
            <option value="">Todos</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
        </select>
    </div>

    <button
        type="button"
        class="admin-button admin-button-secondary"
        id="btn-clear-product-filters"
    >
        Limpiar
    </button>
</section>