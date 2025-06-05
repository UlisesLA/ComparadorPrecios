// index.js

/**
 * Listado de unidades de medida organizadas por categoría
 * @type {Object}
 */
const CATEGORIAS_UNIDADES = {
    masa: ["g", "Kg"],
    volumen: ["ml", "L"],
    longitud: ["cm", "m"],
    unidad: ["Piza", "Caja", "Paquete"]
};

/* =========  UTILIDADES GENERALES  ========= */

/**
 * Convierte un texto con símbolo $, comas o espacios a número flotante.
 * Ej: "$1,234.50" → 1234.5
 */
function convertirANumero(valor) {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    // Quitamos todo lo que NO sea dígito, punto o coma
    const limpio = valor.replace(/[^\d.,-]/g, '')
                        .replace(',', '.'); // por si viene con coma decimal
    return parseFloat(limpio) || 0;
}

/**
 * Formatea el campo de precio al salir (blur).  Si el usuario borra todo,
 * se deja vacío para que la validación HTML5 “required” actúe después.
 */
function formatearPrecio(input) {
    const texto = input.value.trim();

    if (texto === '') return; // dejar vacío si se borró todo

    // Quitar símbolos que no sean dígitos, punto o coma
    const normalizado = texto
        .replace(/[^\d.,-]/g, '')   // todo lo que no sea número, punto o coma
        .replace(',', '.');         // convertir coma decimal a punto

    const num = parseFloat(normalizado);
    if (isNaN(num)) {
        // Si lo que quedó no es un número válido, limpialo
        input.value = '';
        return;
    }

    // Escribir con dos decimales
    input.value = num.toFixed(2);
}


/**
 * Capitaliza la primera letra y pasa el resto a minúsculas.
 * Ej: "mAnZaNaS" → "Manzanas"
 */
function capitalizar(texto = '') {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/**
 * Muestra un mensaje de error en #error-container durante 4 s.
 */
function mostrarError(msg) {
    const div = document.getElementById('error-container');
    div.textContent = msg;
    div.style.display = 'block';
    clearTimeout(div._timer);
    div._timer = setTimeout(() => div.style.display = 'none', 4000);
}

/** Hace visible la caja donde se muestran los resultados */
function mostrarResultados() {
    document.querySelector('.resultado-container')?.classList.add('mostrar');
}

/** Costo unitario = precio total / cantidad */
function calcularCostoUnitario({ precio, cantidad }) {
    return cantidad ? precio / cantidad : Infinity;
}



/**
 * Llena uno o varios <select> con las unidades de medida, agrupadas por categoría.
 * @param {string[]} selectIds - Array con los IDs de los <select> que se van a poblar.
 */
function llenarSelectores(selectIds = []) {
    selectIds.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;               // Si el <select> no existe aún, salimos

        select.innerHTML = '';             // Limpiar opciones anteriores

        // Recorrer las categorías definidas en CATEGORIAS_UNIDADES
        Object.entries(CATEGORIAS_UNIDADES).forEach(([categoria, unidades]) => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = categoria;    // Etiqueta del grupo (masa, volumen, etc.)

            unidades.forEach(u => {
                const option = document.createElement('option');
                option.value = u;
                option.textContent = u;
                optgroup.appendChild(option);
            });

            select.appendChild(optgroup);
        });
    });
}


// ... (funciones existentes se mantienen iguales hasta obtenerDatosProducto)

/**
 * Obtiene y valida los datos de un producto
 * @param {number} id - ID del producto
 * @returns {object|null} Datos del producto validados
 */
function obtenerDatosProducto(id) {
    const nombreInput = document.getElementById(`nombreProducto${id}`);
    const cantidadInput = document.getElementById(`cantidadProducto${id}`);
    const precioInput = document.getElementById(`precioProducto${id}`);
    const unidadSelect = document.getElementById(`unidadMedida${id}`);
    
    if (!nombreInput || !nombreInput.value.trim()) {
        mostrarError(`Ingresa un nombre para el Producto ${id + 1}`);
        return null;
    }
    
    if (!cantidadInput || !cantidadInput.value || parseFloat(cantidadInput.value) <= 0) {
        mostrarError(`Ingresa una cantidad válida para el Producto ${id + 1}`);
        return null;
    }
    
    if (!precioInput || !precioInput.value || convertirANumero(precioInput.value) <= 0) {
        mostrarError(`Ingresa un precio válido para el Producto ${id + 1}`);
        return null;
    }
    
    if (!unidadSelect || !unidadSelect.value) {
        mostrarError(`Selecciona una unidad para el Producto ${id + 1}`);
        return null;
    }
    
    const nombre = capitalizar(nombreInput.value.trim());
    const cantidad = parseFloat(cantidadInput.value);
    const precio = convertirANumero(precioInput.value);
    const unidad = unidadSelect.value;

    return { id, nombre, cantidad, precio, unidad };
}

/**
 * Compara múltiples productos y encuentra el mejor
 */
function calcularMejorProducto() {
    document.querySelector('.resultado-container').classList.remove('mostrar');
    
    const datosProductos = [];
    let mismaCategoria = true;
    let categoriaReferencia = null;

    // Recopilar datos de todos los productos
    for (let i = 0; i < window.productos.length; i++) {
        const producto = obtenerDatosProducto(window.productos[i]);
        if (!producto) return;
        
        datosProductos.push(producto);
        
        // Verificar consistencia de categoría
        if (categoriaReferencia === null) {
            categoriaReferencia = Object.keys(CATEGORIAS_UNIDADES).find(cat => 
                CATEGORIAS_UNIDADES[cat].includes(producto.unidad)
            );
        } else {
            const catActual = Object.keys(CATEGORIAS_UNIDADES).find(cat => 
                CATEGORIAS_UNIDADES[cat].includes(producto.unidad)
            );
            if (catActual !== categoriaReferencia) {
                mismaCategoria = false;
            }
        }
    }
    
    if (!mismaCategoria) {
        mostrarError("Todos los productos deben usar unidades de la misma categoría");
        return;
    }
    
    // Calcular costos unitarios
    const productosConCosto = datosProductos.map(p => ({
        ...p,
        costoUnitario: calcularCostoUnitario(p)
    }));
    
    // Encontrar el producto con menor costo
    const mejorProducto = productosConCosto.reduce((min, p) => 
        p.costoUnitario < min.costoUnitario ? p : min, productosConCosto[0]
    );
    
    // Formatear resultados
    mostrarResultados();
    document.getElementById('mejorProducto').textContent = mejorProducto.nombre;
    
    const formatoMoneda = valor => valor.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    const comparaciones = productosConCosto.map(p => 
        p.id === mejorProducto.id 
            ? `<span class="verde">${p.nombre}: ${formatoMoneda(p.costoUnitario)}/${p.unidad}</span>`
            : `<span class="rojo">${p.nombre}: ${formatoMoneda(p.costoUnitario)}/${p.unidad}</span>`
    ).join('<br>');
    
    document.getElementById('razones').innerHTML = `Costos por ${categoriaReferencia}:<br>${comparaciones}`;
}

