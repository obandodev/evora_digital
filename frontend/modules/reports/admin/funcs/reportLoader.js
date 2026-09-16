import { ReportAPI } from '../../../../api/reportApi.js';

import {
    renderSummary,
    renderInventoryCategories,
    renderInventoryProducts,
    renderSalesCategories,
    renderSalesProducts
} from './reportRender.js';

export async function loadReports(dates) {
    const [
        summary,
        inventoryCategories,
        inventoryProducts,
        salesCategories,
        salesProducts
    ] = await Promise.all([
        ReportAPI.summary(dates),
        ReportAPI.inventoryCategories(),
        ReportAPI.inventory(dates),
        ReportAPI.salesCategories(dates),
        ReportAPI.salesProducts(dates)
    ]);

    renderSummary(summary.data || summary);
    renderInventoryCategories(
        inventoryCategories.data || inventoryCategories
    );
    renderInventoryProducts(
        inventoryProducts.data || inventoryProducts
    );
    renderSalesCategories(
        salesCategories.data || salesCategories
    );
    renderSalesProducts(
        salesProducts.data || salesProducts
    );
}