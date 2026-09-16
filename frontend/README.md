# Glam Beauty — Frontend

Frontend de **Glam Beauty**, una tienda virtual de productos de maquillaje. La interfaz está desarrollada con HTML, CSS y JavaScript utilizando módulos ES y consume la API del backend mediante solicitudes HTTP.

El frontend contiene dos áreas principales:

* Tienda pública.
* Panel administrativo.

## Tecnologías

* HTML5
* CSS3
* JavaScript ES Modules
* Fetch API
* PHP
* Lucide Icons
* Google Fonts
* XAMPP / Apache

## Estructura

```
frontend/
├── api/
│   ├── api.js
│   ├── orderApi.js
│   └── reportApi.js
├── modules/
│   ├── inventory/
│   │   └── admin/
│   │       └── css/
│   │           └── inventory.css
│   ├── orders/
│   │   └── admin/
│   │       └── css/
│   │           └── orders.css
│   ├── products/
│   │   └── admin/
│   │       ├── css/
│   │       ├── components/
│   │       ├── funcs/
│   │       └── pages/
│   └── reports/
│       └── admin/
│           ├── components/
│           ├── css/
│           ├── funcs/
│           └── pages/
├── styles/
│   ├── admin.css
│   ├── admin-shared.css
│   ├── cart.css
│   ├── catalog.css
│   ├── checkout.css
│   ├── footer.css
│   ├── global.css
│   ├── header.css
│   ├── home.css
│   ├── login.css
│   └── product.css
└── ...
```

## Arquitectura

El frontend separa las responsabilidades de la interfaz:

```
Pages
 ↓
Funcs
 ↓
API
 ↓
Backend
```

### Pages

Contienen las páginas que se muestran al usuario.

### Components

Contienen elementos reutilizables de la interfaz.

### Funcs

Contienen la lógica específica de cada módulo.

### API

Centraliza las solicitudes realizadas al backend.

### CSS

Contiene los estilos generales y específicos de cada módulo.

## API

La comunicación con el backend se centraliza principalmente mediante:

```frontend/api/api.js```

Los módulos específicos utilizan archivos separados:

```
frontend/api/orderApi.js
frontend/api/reportApi.js
```

Esto permite mantener separada la lógica de comunicación de la lógica visual.

## Área pública

La tienda pública permite al cliente:

* Visualizar el catálogo.
* Buscar productos.
* Filtrar productos.
* Consultar información de productos.
* Agregar productos al carrito.
* Modificar cantidades.
* Revisar el carrito.
* Realizar el checkout.
* Crear pedidos.
* Recibir la confirmación del pedido.

El cliente no necesita crear una cuenta ni iniciar sesión.

## Catálogo

El catálogo muestra información relacionada con los productos disponibles.

Entre los datos utilizados se encuentran:

* Nombre.
* Marca.
* Categoría.
* Descripción.
* Precio.
* Imagen.
* Color.
* Disponibilidad.

Los productos son obtenidos desde el backend mediante la API.

## Carrito

El carrito permite:

* Agregar productos.
* Aumentar cantidades.
* Disminuir cantidades.
* Eliminar productos.
* Visualizar subtotales.
* Calcular el total.

El carrito posteriormente envía los productos seleccionados al proceso de checkout.

## Checkout

El checkout recopila la información necesaria para crear un pedido.

Datos principales:

```
Nombre del cliente
Teléfono
Correo electrónico
Dirección
Ciudad
Notas
Productos
```

El pedido es enviado al backend mediante:

```http POST /orders```

Ejemplo:

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

## Panel administrativo

El panel administrativo está destinado exclusivamente a usuarios autorizados.

Actualmente contiene módulos relacionados con:

* Productos.
* Inventario.
* Pedidos.
* Reportes.

## Productos

El módulo administrativo de productos permite trabajar con el catálogo interno.

La estructura principal es:

```
modules/products/admin/
├── css/
├── components/
├── funcs/
└── pages/
```

Entre las operaciones disponibles se encuentran:

* Visualizar productos.
* Crear productos.
* Actualizar productos.
* Cambiar estado.
* Asociar categorías.
* Gestionar información del producto.

## Inventario

El módulo de inventario permite controlar las existencias de los productos.

Se trabaja con información como:

* Stock actual.
* Stock mínimo.
* Entradas.
* Salidas.
* Movimientos.

Cuando un cliente realiza un pedido, el backend descuenta automáticamente las unidades correspondientes.

## Pedidos

El módulo administrativo permite consultar los pedidos realizados por los clientes.

Los estados utilizados son:

```
PENDING
CONFIRMED
SHIPPED
DELIVERED
CANCELLED
```

El administrador puede consultar la información del pedido y actualizar su estado.

## Reportes

El módulo de reportes permite visualizar información administrativa sobre ventas e inventario.

### Resumen

Muestra:

* Ventas totales.
* Pedidos entregados.
* Promedio por pedido.
* Valor del inventario.
* Total de productos.
* Total de unidades.
* Productos con stock bajo.
* Productos agotados.

### Inventario por categoría

Muestra:

* Categoría.
* Productos.
* Unidades.
* Valor del inventario.

### Inventario por producto

Muestra:

* Producto.
* Categoría.
* Precio.
* Stock.
* Stock mínimo.
* Valor del inventario.
* Estado.

### Ventas por categoría

Muestra:

* Categoría.
* Unidades vendidas.
* Valor de ventas.

### Ventas por producto

Muestra:

* Producto.
* Categoría.
* Unidades vendidas.
* Valor de ventas.

Los reportes de ventas utilizan los pedidos con estado:

```DELIVERED```

## Filtros de reportes

El módulo permite seleccionar un rango de fechas para consultar información de ventas.

Los valores utilizados son:

```
from
to
```

Por ejemplo:

```
2026-09-01
2026-09-30
```

El frontend transforma estos valores en parámetros para las solicitudes de la API.

## Diseño visual

Glam Beauty utiliza una identidad visual enfocada en una estética elegante y femenina.

Variables principales:

```
--blush:#FBF1EC;
--soft-blush:#F5E4DE;
--wine:#8C2F49;
--wine-dark:#6B1F38;
--gold:#C9A15A;
--text:#2B1620;
--text-light:#817477;
--border:#E7D7D2;
--white:#FFFFFF;
```

## Tipografías

La interfaz utiliza:

### Work Sans

Utilizada principalmente para:

* Texto.
* Formularios.
* Tablas.
* Botones.
* Información general.

### Fraunces

Utilizada principalmente para:

* Títulos.
* Encabezados.
* Elementos destacados.

Las fuentes se cargan desde Google Fonts.

## Componentes visuales

El frontend utiliza componentes y estilos separados para mantener una estructura organizada.

Algunos elementos incluyen:

* Tablas.
* Formularios.
* Modales.
* Botones.
* Tarjetas.
* Filtros.
* Badges de estado.
* Navegación administrativa.

## Responsive Design

La interfaz está preparada para diferentes tamaños de pantalla.

Los principales puntos de adaptación utilizados actualmente son:

```
1000px
750px
500px
```

En dispositivos pequeños:

* Los encabezados se reorganizan.
* Los filtros pasan a disposición vertical.
* Los botones pueden ocupar todo el ancho.
* Las tablas utilizan desplazamiento horizontal.
* Las tarjetas se reorganizan en columnas.

## Reportes — estructura JavaScript

El módulo de reportes separa:

```
reportLoader.js
reportRender.js
reportFormat.js
```

### reportLoader.js

Se encarga de solicitar la información al backend.

### reportRender.js

Se encarga de transformar los datos recibidos en elementos HTML.

### reportFormat.js

Contiene funciones relacionadas con el formato de números, moneda y contenido HTML.

Esta separación evita mezclar las solicitudes HTTP con la representación visual.

## Comunicación con la API

Las solicitudes se realizan utilizando `fetch` mediante la capa API.

Ejemplo conceptual:

```
Frontend
   │
   ▼
GlamAPI
   │
   ▼
Backend API
   │
   ▼
MySQL / MariaDB
```

El frontend no accede directamente a la base de datos.

## Ejecución local

El proyecto está preparado para ejecutarse con XAMPP.

Ruta:

```C:\xampp\htdocs\glam-beauty```

Iniciar desde XAMPP:

```
Apache
MySQL
```

Después acceder al proyecto mediante:

```http://localhost/glam-beauty/```

Las páginas PHP del frontend se ejecutan mediante Apache.

## Recomendaciones de desarrollo

Para mantener la estructura del proyecto:

* Mantener separada la lógica de API.
* Evitar consultas directas a la base de datos desde el frontend.
* Mantener los estilos específicos dentro de sus respectivos módulos.
* Reutilizar componentes cuando sea necesario.
* Mantener la lógica JavaScript dentro de `funcs`.
* Escapar contenido dinámico antes de insertarlo en HTML.
* Mantener las rutas de API centralizadas.
* Evitar duplicar lógica entre módulos.

## Estado del proyecto

El frontend cuenta actualmente con:

* Tienda pública.
* Catálogo.
* Búsqueda y filtros.
* Carrito.
* Checkout.
* Creación de pedidos.
* Panel administrativo.
* Gestión de productos.
* Gestión de inventario.
* Gestión de pedidos.
* Reportes.
* Filtros de fechas.
* Diseño responsive.
* Integración con la API PHP.

## Alcance actual

Glam Beauty está planteado como una tienda virtual de maquillaje.

El proyecto actualmente **no incluye**:

* Pagos en línea.
* Aplicación móvil.
* Domicilios propios.
* Facturación electrónica.
* Registro de clientes.

La gestión de pedidos se realiza mediante el sistema administrativo.

---

**Glam Beauty — Frontend**

Interfaz web para la tienda virtual y administración del sistema.