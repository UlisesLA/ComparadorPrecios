// render.js

// Estado global para controlar los productos dinámicos
window.productos = [];          // Array de IDs de productos actualmente en la interfaz
let contadorProductos = 0;      // Contador para asignar IDs únicos a nuevos productos
const MAX_PRODUCTOS = 5;        // Límite máximo de productos permitidos

/**
 * Genera el HTML para un nuevo bloque de producto.
 * @param {number} id - ID único del producto (se usará para IDs de elementos).
 * @returns {string} Cadena de texto con el HTML del producto.
 */
function crearPlantillaProducto(id) {
    return `
        <section class="producto" id="producto-${id}" aria-labelledby="titulo-producto-${id}">
            <div class="encabezado-producto">
                <h2 id="titulo-producto-${id}">Producto ${id + 1}</h2>
                ${id > 1 
                    ? `<button class="btn-eliminar" onclick="eliminarProducto(${id})" title="Eliminar producto ${id+1}">✕</button>` 
                    : ''}
            </div>
            <div class="campo-formulario">
                <label for="nombreProducto${id}">Nombre:</label>
                <input id="nombreProducto${id}" type="text" placeholder="Ej. Manzanas Rojas" required>
                <p class="ayuda">Ingresa el nombre del producto</p>
            </div>
            <div class="campo-formulario">
                <label for="cantidadProducto${id}">Cantidad:</label>
                <div class="grupo-cantidad">
                    <input id="cantidadProducto${id}" type="number" min="0.01" step="0.01" placeholder="Ej. 1000" required>
                    <select id="unidadMedida${id}" class="selector-unidad" aria-label="Unidad de medida" required></select>
                </div>
                <p class="ayuda">Cantidad según la unidad seleccionada</p>
            </div>
            <div class="campo-formulario campo-precio">
                <label for="precioProducto${id}">Precio:</label>
                <input id="precioProducto${id}" type="text"
                    inputmode="decimal"
                    placeholder="Ej. 12.50" required
                    onblur="formatearPrecio(this)">
                <p class="ayuda">Precio total del paquete</p>
            </div>
        </section>
    `;
}

/**
 * Agrega un nuevo producto al contenedor dinámico, hasta un máximo de 5.
 */
function agregarProducto() {
    if (contadorProductos >= MAX_PRODUCTOS) {
        // Ya se alcanzó el número máximo de productos
        mostrarError(`Máximo ${MAX_PRODUCTOS} productos permitidos`);
        return;
    }

    const id = contadorProductos++;
    window.productos.push(id);

    // Insertar el bloque de producto generado al final del contenedor
    const productoHTML = crearPlantillaProducto(id);
    document.getElementById('productos-container').insertAdjacentHTML('beforeend', productoHTML);

    // Inicializar el selector de unidad de medida del nuevo producto usando la función de index.js
    llenarSelectores([`unidadMedida${id}`]);

    // Actualizar la visibilidad del botón agregar (ocultarlo si ya llegamos a 5)
    actualizarBotonAgregar();
}

/**
 * Elimina un producto específico identificado por su ID.
 * @param {number} id - ID del producto a eliminar.
 */
function eliminarProducto(id) {
    if (window.productos.length <= 2) {
        // Impedir eliminar si solo quedan 2 productos (mínimo requerido)
        return;
    }
    const index = window.productos.indexOf(id);
    if (index !== -1) {
        // Remover del estado y del DOM
        window.productos.splice(index, 1);
        document.getElementById(`producto-${id}`).remove();
        // Reindexar los productos restantes
        actualizarIndicesProductos();
        // Mostrar de nuevo el botón de agregar si corresponde
        actualizarBotonAgregar();
    }
}

/**
 * Recorre los productos actuales y reestablece sus IDs de forma secuencial (0,1,2,...),
 * reconstruyendo sus elementos HTML. Se invoca tras eliminar un producto para mantener
 * la coherencia de los identificadores y la numeración visible.
 */
function actualizarIndicesProductos() {
    const contenedor = document.getElementById('productos-container');
    contenedor.innerHTML = '';  // Vaciar el contenedor antes de reinsertar

    // Recorrer la lista de productos actuales y reinsertarlos con nuevos IDs secuenciales
    window.productos.forEach((oldId, index) => {
        const nuevoId = index;
        window.productos[index] = nuevoId;  // actualizar el ID en el array
        contenedor.insertAdjacentHTML('beforeend', crearPlantillaProducto(nuevoId));
        llenarSelectores([`unidadMedida${nuevoId}`]);
    });

    // Ajustar el contador de productos al nuevo total (para asignar correctamente el próximo ID)
    contadorProductos = window.productos.length;
}

/**
 * Actualiza la visibilidad del botón "Agregar otro producto" según el número de productos.
 * Si se alcanzó el máximo permitido, oculta el botón; si no, lo muestra.
 */
function actualizarBotonAgregar() {
    const btnAgregar = document.getElementById('btn-agregar-producto');
    btnAgregar.style.display = window.productos.length < MAX_PRODUCTOS ? 'block' : 'none';
}

// Inicialización cuando el DOM ha cargado
document.addEventListener('DOMContentLoaded', () => {
    // Asignar evento al botón de agregar producto
    document.getElementById('btn-agregar-producto').addEventListener('click', agregarProducto);
    // Crear dos productos iniciales por defecto
    agregarProducto();
    agregarProducto();
    
    document.addEventListener('input', e => {
        if (e.target.matches('[id^="precioProducto"]')) {
            e.target.value = e.target.value.replace(/[^\d.,]/g, '');
        }
    });

});
