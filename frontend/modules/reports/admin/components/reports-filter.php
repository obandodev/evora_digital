<section class="report-card report-filters">
    <div class="report-filter-group">
        <label for="report-period">Periodo</label>
        <select id="report-period">
            <option value="all">Todo</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
            <option value="custom">Personalizado</option>
        </select>
    </div>

    <div class="report-filter-group report-custom-date is-hidden" id="report-custom-dates">
        <label for="report-from">Desde</label>
        <input type="date" id="report-from">
    </div>

    <div class="report-filter-group report-custom-date is-hidden" id="report-custom-to-wrap">
        <label for="report-to">Hasta</label>
        <input type="date" id="report-to">
    </div>

    <button type="button" class="report-filter-button" id="report-apply">
        Actualizar
    </button>
</section>

<div id="report-error" class="report-message report-error is-hidden"></div>