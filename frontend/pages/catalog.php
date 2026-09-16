<?php
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../components/header.php';
?>

<link rel="stylesheet" href="<?= GLAM_FRONTEND_URL ?>/styles/catalog.css">

<main class="catalog-page">
    <section class="catalog-header">
        <div>
            <span class="eyebrow">GLAM BEAUTY</span>
            <h1>Catálogo</h1>
            <p>
                Explora nuestra selección de productos de belleza.
            </p>
        </div>
    </section>

    <section class="catalog-content">
        <form id="catalog-filters" class="catalog-filters">
            <div class="filter-group">
                <label for="search-filter">Buscar</label>
                <input
                    type="search"
                    id="search-filter"
                    placeholder="Buscar producto..."
                >
            </div>

            <div class="filter-group">
                <label for="category-filter">Categoría</label>
                <select id="category-filter">
                    <option value="">Todas las categorías</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="brand-filter">Marca</label>
                <input
                    type="text"
                    id="brand-filter"
                    placeholder="Ej. Maybelline"
                >
            </div>

            <button type="submit" class="btn btn-primary">
                Buscar
            </button>
        </form>

        <div id="catalog-products" class="catalog-products">
            <p class="loading-message">Cargando productos...</p>
        </div>

        <div id="catalog-pagination" class="catalog-pagination"></div>
    </section>
</main>

<?php require_once __DIR__ . '/../components/footer.php'; ?>

<script type="module" src="<?= GLAM_FRONTEND_URL ?>/funcs/catalog.js"></script>