# Glam Beauty — Backend

Backend de **Glam Beauty**, una tienda virtual de maquillaje desarrollada con PHP y MySQL/MariaDB. Se encarga de la lógica del sistema, acceso a base de datos, autenticación administrativa, productos, inventario, pedidos y reportes.

## Tecnologías

* PHP 8.2+
* MySQL / MariaDB
* PDO
* API REST
* Apache
* XAMPP

## Estructura

backend/
├── api/
│   └── index.php
├── config/
│   ├── Database.php
│   └── config.php
├── controllers/
│   ├── OrderController.php
│   └── ReportController.php
├── core/
│   ├── Request.php
│   └── Response.php
├── middleware/
│   └── AuthMiddleware.php
├── models/
│   ├── Inventory.php
│   ├── Order.php
│   ├── Product.php
│   └── Report.php
├── public/
├── uploads/
├── .gitignore
├── README.md
└── seed_admin.php

## Base de datos

La aplicación utiliza una base de datos MySQL/MariaDB para almacenar la información de productos, categorías, inventario, usuarios y pedidos.

### Tablas principales

* `users`
* `categories`
* `products`
* `product_images`
* `inventory`
* `inventory_movements`
* `orders`
* `order_details`

### Relaciones principales

```
categories
    │
    └── products
            │
            ├── product_images
            │
            └── inventory
                    │
                    └── inventory_movements

orders
    │
    └── order_details
            │
            └── products
```

## Configuración

La conexión con la base de datos se encuentra en:

```backend/config/Database.php```

La configuración general se encuentra en:

```backend/config/config.php```

La base de datos utilizada por el proyecto es:

```glam_beauty```

## Ejecución local

El proyecto está preparado para ejecutarse mediante XAMPP.

Ruta esperada:

```C:\xampp\htdocs\glam-beauty```

La API principal se encuentra en:

```http://localhost/glam-beauty/backend/api/index.php```

Es necesario iniciar desde XAMPP:

* Apache
* MySQL

## Usuario administrador

El sistema utiliza autenticación únicamente para administradores.

El archivo:

```backend/seed_admin.php```

permite inicializar el usuario administrador.

La contraseña debe almacenarse utilizando hash y nunca como texto plano.

El cliente de la tienda no necesita registrarse ni iniciar sesión para realizar un pedido.

## API

Las rutas principales están centralizadas en:

```backend/api/index.php```

### Pedidos públicos

Crear un pedido:

```http POST /orders```

Ejemplo de información enviada:

```json
{
    "customer_name": "Juan Pérez",
    "customer_phone": "3001234567",
    "customer_email": "juan@email.com",
    "delivery_address": "Calle 10 #20-30",
    "delivery_city": "Bogotá",
    "notes": "",
    "items": [
        {
            "product_id": 2,
            "quantity": 1
        }
    ]
}
```

## Pedidos administrativos

Consultar pedidos:

```http GET /admin/orders```

Consultar un pedido:

```http GET /admin/orders/{id}```

Actualizar el estado:

```http PUT /admin/orders/{id}/status```

Los estados disponibles son:

```
PENDING
CONFIRMED
SHIPPED
DELIVERED
CANCELLED
```

El acceso a estas rutas requiere autenticación administrativa.

## Flujo de creación de pedidos

Cuando un cliente realiza un pedido, el backend:

1. Valida la información recibida.
2. Valida los productos solicitados.
3. Bloquea el registro de inventario correspondiente.
4. Comprueba que exista stock suficiente.
5. Obtiene el precio actual del producto.
6. Calcula el subtotal.
7. Calcula el total del pedido.
8. Crea el registro en `orders`.
9. Crea los registros correspondientes en `order_details`.
10. Descuenta las unidades del inventario.
11. Registra el movimiento de salida en `inventory_movements`.
12. Confirma la transacción.

Si ocurre un error durante el proceso, la transacción se revierte.

## Inventario

El inventario está relacionado directamente con los productos.

El sistema permite controlar:

* Stock actual.
* Stock mínimo.
* Valor del inventario.
* Entradas.
* Salidas.
* Movimientos de inventario.

Los movimientos pueden utilizarse para mantener trazabilidad de los cambios realizados sobre las existencias.

Cuando se genera un pedido, las unidades vendidas se descuentan automáticamente.

## Reportes

El backend proporciona información para el módulo administrativo de reportes.

### Resumen

```http GET /admin/reports/summary```

Incluye:

* Ventas totales.
* Pedidos entregados.
* Promedio por pedido.
* Valor del inventario.
* Total de productos.
* Total de unidades.
* Productos con stock bajo.
* Productos agotados.

### Inventario por categoría

```http GET /admin/reports/inventory/categories```

Incluye:

* Categoría.
* Cantidad de productos.
* Unidades disponibles.
* Valor del inventario.

### Inventario por producto

```http GET /admin/reports/inventory```

Incluye:

* Producto.
* Categoría.
* Precio.
* Stock.
* Stock mínimo.
* Valor del inventario.
* Estado del stock.

Los estados utilizados son:

```
AVAILABLE
LOW
OUT_OF_STOCK
```

### Ventas por categoría

```http GET /admin/reports/sales/categories```

Incluye:

* Categoría.
* Unidades vendidas.
* Valor de las ventas.

### Ventas por producto

```http GET /admin/reports/sales/products```

Incluye:

* Producto.
* Categoría.
* Unidades vendidas.
* Valor de las ventas.

Los reportes de ventas consideran como venta completada los pedidos cuyo estado sea:

```
DELIVERED
```

## Filtros de fecha

Los reportes de ventas y el resumen pueden recibir:

```
from
to
```

Ejemplo:

```/admin/reports/sales/products?from=2026-09-01&to=2026-09-30```

Los filtros utilizan la fecha de creación del pedido.

## Seguridad

El backend utiliza diferentes mecanismos para proteger la aplicación:

* Autenticación administrativa.
* Middleware para rutas protegidas.
* Contraseñas almacenadas mediante hash.
* Consultas preparadas mediante PDO.
* Validación de información recibida.
* Control transaccional para operaciones de inventario y pedidos.
* Separación entre rutas públicas y administrativas.

Los clientes pueden crear pedidos sin autenticarse, mientras que las operaciones administrativas requieren sesión.

## Arquitectura

El backend está organizado separando responsabilidades:

```
API
 ↓
Controllers
 ↓
Models
 ↓
Database
```

### API

Recibe las solicitudes HTTP y determina qué operación debe ejecutarse.

### Controllers

Gestionan las solicitudes y respuestas de cada módulo.

### Models

Contienen la lógica relacionada con la información almacenada en la base de datos.

### Middleware

Controla el acceso a las rutas protegidas.

### Config

Contiene la configuración y conexión con la base de datos.

## Módulos actuales

El backend actualmente maneja:

* Autenticación administrativa.
* Productos.
* Inventario.
* Pedidos.
* Reportes.
* Categorías mediante relaciones con productos.

## Estado del proyecto

El backend cuenta actualmente con:

* Conexión MySQL/MariaDB.
* API funcional.
* Autenticación administrativa.
* Gestión de productos.
* Gestión de inventario.
* Creación de pedidos.
* Actualización de estados de pedidos.
* Descuento automático de inventario.
* Registro de movimientos.
* Reportes de inventario.
* Reportes de ventas.
* Filtros por fecha en reportes de ventas.

## Entorno de desarrollo

El proyecto fue desarrollado y probado utilizando:

```
Windows
XAMPP
Apache
PHP 8.2+
MySQL/MariaDB
```

La ruta local principal es:

```text
C:\xampp\htdocs\glam-beauty
```

## Próximas mejoras

Entre las posibles mejoras futuras se encuentran:

* Mayor control de permisos administrativos.
* Auditoría de acciones administrativas.
* Mejoras en gestión de imágenes.
* Optimización de consultas.
* Paginación para grandes cantidades de registros.
* Validaciones adicionales.
* Configuración específica para producción.


**Glam Beauty — Backend**

Sistema web de gestión y comercio electrónico para productos de belleza.
