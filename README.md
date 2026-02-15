# Comparador de Precios Inteligente

Aplicación web desarrollada en JavaScript puro que permite comparar múltiples productos y determinar cuál ofrece el mejor costo por unidad.

El sistema calcula automáticamente el costo unitario (precio total dividido entre cantidad) y muestra cuál producto conviene más, asegurando que las unidades comparadas pertenezcan a la misma categoría.

---

## Objetivo del Proyecto

Este proyecto fue diseñado para:

- Comparar productos con distintas presentaciones.
- Calcular automáticamente el costo por unidad.
- Validar coherencia entre categorías de unidades.
- Reducir errores humanos al comparar precios manualmente.
- Servir como herramienta educativa para comprender análisis de costo.

---

## Tecnologías Utilizadas

El proyecto está construido completamente con tecnologías frontend puras:

- HTML5
- CSS3
- JavaScript (Vanilla JS)

No utiliza frameworks, librerías externas ni backend.

---

## Estructura del Proyecto

/proyecto  
│  
├── index.html        # Estructura principal de la aplicación  
├── index.js          # Lógica principal de cálculo y validaciones  
├── render.js         # Render dinámico de productos  
├── style.css         # Estilos visuales  
└── README.md         # Documentación del proyecto  

---

## Funcionamiento General

La aplicación permite agregar múltiples productos dinámicamente. Cada producto requiere:

- Nombre
- Cantidad
- Precio total
- Unidad de medida

El sistema realiza las siguientes operaciones:

1. Valida que todos los campos estén correctamente llenos.
2. Convierte el precio ingresado en formato texto a número flotante.
3. Verifica que todos los productos pertenezcan a la misma categoría de unidad.
4. Calcula el costo unitario.
5. Determina el producto con menor costo unitario.
6. Muestra el resultado destacado junto con una comparativa completa.

---

## Categorías de Unidades

Las unidades están agrupadas por categoría para evitar comparaciones inválidas:

- Masa: g, Kg
- Volumen: ml, L
- Longitud: cm, m
- Unidad: Piza, Caja, Paquete

La comparación solo es válida si todos los productos pertenecen a la misma categoría.

---

## Fórmula Utilizada

Costo Unitario = Precio Total / Cantidad

Si la cantidad es 0, el sistema evita la división inválida retornando Infinity.

---

## Validaciones Implementadas

El sistema verifica que:

- El nombre del producto no esté vacío.
- La cantidad sea mayor que 0.
- El precio sea válido y mayor que 0.
- Se haya seleccionado una unidad.
- Todas las unidades pertenezcan a la misma categoría.

Los errores se muestran temporalmente en pantalla.

---

## Formato de Moneda

Los valores se formatean usando la configuración regional de México:

toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN'
})

Moneda utilizada: Peso Mexicano (MXN)

---

## Ejecución del Proyecto

No requiere instalación ni dependencias.

### Método 1: Abrir directamente

1. Descargar el repositorio.
2. Abrir la carpeta.
3. Ejecutar index.html en cualquier navegador moderno.

### Método 2: Usar servidor local (recomendado)

Con VSCode (Live Server):
Click derecho sobre index.html → Open with Live Server

Con Node.js:
npx serve .

---

## Flujo Interno del Sistema

1. Se renderizan dinámicamente los productos.
2. Se capturan los inputs del usuario.
3. Se validan los datos.
4. Se normaliza el precio ingresado.
5. Se calcula el costo unitario.
6. Se determina el menor costo.
7. Se muestran resultados.

---

## Funciones Principales

convertirANumero()
Convierte texto con símbolos ($, comas, espacios) a número flotante.

formatearPrecio()
Normaliza el campo precio a dos decimales.

capitalizar()
Capitaliza la primera letra del nombre del producto.

mostrarError()
Muestra mensajes temporales de error.

calcularCostoUnitario()
Calcula precio dividido entre cantidad.

calcularMejorProducto()
Función principal que ejecuta todo el proceso de comparación.

---

## Limitaciones Actuales

- No convierte automáticamente entre unidades (ejemplo: g a Kg).
- No guarda datos.
- No tiene persistencia ni backend.
- No permite historial de comparaciones.

---

## Mejoras Futuras Propuestas

- Conversión automática entre unidades.
- Soporte multi-moneda.
- Persistencia con LocalStorage.
- Exportación de resultados a PDF.
- Historial de comparaciones.
- Modo oscuro.
- Diseño responsive mejorado.
- Versión SaaS con backend.

---

## Caso de Uso Ejemplo

Producto A:
500 g por $25

Producto B:
1 Kg por $45

El sistema calculará el costo por gramo y determinará cuál es la opción más conveniente.

---

## Propósito a Largo Plazo

Este proyecto sirve como base para:

- Herramientas de análisis de consumo.
- Aplicaciones educativas.
- Sistemas de optimización de compras.
- Posible evolución a producto comercial o SaaS.

---

## Autor

Desarrollado por Ulises Amezcua.

---

## Licencia

Uso libre para fines educativos y personales.