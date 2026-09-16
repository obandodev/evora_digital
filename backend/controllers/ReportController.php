<?php
require_once __DIR__ . '/../models/Report.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class ReportController
{
    private Report $model;

    public function __construct()
    {
        $this->model = new Report();
    }

    public function summary(): void
    {
        $this->authorize();

        [$from, $to] = $this->dates();

        Response::success(
            $this->model->getSummary($from, $to)
        );
    }

    public function inventory(): void
    {
        $this->authorize();

        Response::success(
            $this->model->getInventoryProducts()
        );
    }

    public function inventoryCategories(): void
    {
        $this->authorize();

        Response::success(
            $this->model->getInventoryByCategory()
        );
    }

    public function salesCategories(): void
    {
        $this->authorize();

        [$from, $to] = $this->dates();

        Response::success(
            $this->model->getSalesByCategory($from, $to)
        );
    }

    public function salesProducts(): void
    {
        $this->authorize();

        [$from, $to] = $this->dates();

        Response::success(
            $this->model->getSalesByProduct($from, $to)
        );
    }

    private function authorize(): void
    {
        AuthMiddleware::requireRole(['ADMIN']);
    }

    private function dates(): array
    {
        $from = Request::query('from');
        $to = Request::query('to');

        if (
            $from !== null &&
            !preg_match('/^\d{4}-\d{2}-\d{2}$/', $from)
        ) {
            Response::error(
                'La fecha inicial no es válida',
                422
            );
        }

        if (
            $to !== null &&
            !preg_match('/^\d{4}-\d{2}-\d{2}$/', $to)
        ) {
            Response::error(
                'La fecha final no es válida',
                422
            );
        }

        if (
            $from !== null &&
            $to !== null &&
            $from > $to
        ) {
            Response::error(
                'La fecha inicial no puede ser mayor que la fecha final',
                422
            );
        }

        return [$from, $to];
    }
}