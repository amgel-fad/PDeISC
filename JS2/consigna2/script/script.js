// ============================================================
//  TODA LA LÓGICA EN UN SOLO SCRIPT (SIN SERVIDOR)
// ============================================================

// ----- DOM -----
const fileInput = document.getElementById('fileInput');
const nombreArchivo = document.getElementById('nombreArchivo');
const btnProcesar = document.getElementById('btnProcesar');
const resultadosFiltro = document.getElementById('resultadosFiltro');
const totalNumeros = document.getElementById('totalNumeros');
const utiles = document.getElementById('utiles');
const noUtiles = document.getElementById('noUtiles');
const porcentaje = document.getElementById('porcentaje');
const numerosUtiles = document.getElementById('numerosUtiles');
const btnDescargarFiltrado = document.getElementById('btnDescargarFiltrado');
const mensajeGlobal = document.getElementById('mensajeGlobal');
const toggleTheme = document.getElementById('toggleTheme');
const fechaSpan = document.getElementById('fechaActual');
const climaSpan = document.getElementById('climaActual');

// ----- FECHA (básica) -----
function actualizarFecha() {
    const ahora = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fechaSpan.textContent = ahora.toLocaleDateString('es-ES', opciones);
}
actualizarFecha();

// ----- CLIMA FIJO (sin API) -----
climaSpan.innerHTML = 'clima feo ☠️';

// ----- TEMA DÍA/NOCHE -----
const THEME_KEY = 'theme';
function cargarTema() {
    const tema = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', tema);
    toggleTheme.innerHTML = tema === 'dark' ? '☀️ Modo Día' : '🌙 Modo Noche';
}
function alternarTema() {
    const actual = document.documentElement.getAttribute('data-theme');
    const nuevo = actual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nuevo);
    localStorage.setItem(THEME_KEY, nuevo);
    toggleTheme.innerHTML = nuevo === 'dark' ? '☀️ Modo Día' : '🌙 Modo Noche';
}
toggleTheme.addEventListener('click', alternarTema);
cargarTema();

// ----- MENSAJES -----
function mostrarMensaje(texto, tipo = 'error') {
    mensajeGlobal.textContent = texto;
    mensajeGlobal.className = 'mensaje-global ' + tipo;
    clearTimeout(mensajeGlobal._timeout);
    mensajeGlobal._timeout = setTimeout(() => {
        mensajeGlobal.className = 'mensaje-global';
        mensajeGlobal.textContent = '';
    }, 5000);
}

// ----- EVENTOS -----
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        nombreArchivo.textContent = file.name;
        btnProcesar.disabled = false;
        resultadosFiltro.style.display = 'none';
        btnDescargarFiltrado.style.display = 'none';
    } else {
        nombreArchivo.textContent = 'Ningún archivo seleccionado';
        btnProcesar.disabled = true;
    }
});

btnProcesar.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
        mostrarMensaje('Selecciona un archivo .txt primero.', 'error');
        return;
    }

    btnProcesar.disabled = true;
    btnProcesar.textContent = '⏳ Procesando...';

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const contenido = e.target.result;
            // Extraer todos los números enteros positivos (máximo 7 dígitos)
            const numeros = [];
            const matches = contenido.match(/\d+/g);
            if (matches) {
                for (const match of matches) {
                    const num = Number(match);
                    if (Number.isInteger(num) && match.length <= 7) {
                        numeros.push(num);
                    }
                }
            }

            if (numeros.length === 0) {
                mostrarMensaje('El archivo no contiene números válidos (enteros ≥0 y ≤7 dígitos).', 'error');
                btnProcesar.disabled = false;
                btnProcesar.textContent = '⚙️ Procesar archivo';
                return;
            }

            // Filtrar: primer y último dígito iguales
            const utilesArray = numeros.filter(num => {
                const str = String(Math.abs(num));
                const primer = str.charAt(0);
                const ultimo = str.charAt(str.length - 1);
                return primer === ultimo;
            });

            // Orden ascendente
            utilesArray.sort((a, b) => a - b);

            // Estadísticas
            const total = numeros.length;
            const cantidadUtiles = utilesArray.length;
            const cantidadNoUtiles = total - cantidadUtiles;
            const porcentajeUtiles = total > 0 ? (cantidadUtiles / total) * 100 : 0;

            // Mostrar resultados
            totalNumeros.textContent = total;
            utiles.textContent = cantidadUtiles;
            noUtiles.textContent = cantidadNoUtiles;
            porcentaje.textContent = porcentajeUtiles.toFixed(2) + '%';

            numerosUtiles.innerHTML = '';
            if (utilesArray.length === 0) {
                numerosUtiles.innerHTML = '<span style="color: var(--text-secondary);">No hay números que cumplan la condición.</span>';
            } else {
                utilesArray.forEach(num => {
                    const span = document.createElement('span');
                    span.className = 'utiles-item';
                    span.textContent = num;
                    numerosUtiles.appendChild(span);
                });
            }

            // Guardar datos para descarga
            btnDescargarFiltrado.dataset.utiles = JSON.stringify(utilesArray);
            btnDescargarFiltrado.style.display = 'inline-flex';

            resultadosFiltro.style.display = 'block';
            resultadosFiltro.scrollIntoView({ behavior: 'smooth', block: 'start' });
            mostrarMensaje('Filtrado completado exitosamente.', 'success');

        } catch (error) {
            console.error(error);
            mostrarMensaje('Error al procesar el archivo.', 'error');
        } finally {
            btnProcesar.disabled = false;
            btnProcesar.textContent = '⚙️ Procesar archivo';
        }
    };

    reader.onerror = function() {
        mostrarMensaje('Error al leer el archivo.', 'error');
        btnProcesar.disabled = false;
        btnProcesar.textContent = '⚙️ Procesar archivo';
    };

    reader.readAsText(file);
});

// Descargar archivo filtrado (generado en el cliente)
btnDescargarFiltrado.addEventListener('click', () => {
    const data = btnDescargarFiltrado.dataset.utiles;
    if (!data) {
        mostrarMensaje('No hay datos para descargar. Procesa un archivo primero.', 'error');
        return;
    }
    const utilesArray = JSON.parse(data);
    if (utilesArray.length === 0) {
        mostrarMensaje('No hay números útiles para guardar.', 'info');
        return;
    }
    const contenido = utilesArray.join('\n');
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'numeros_filtrados.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarMensaje('Archivo filtrado descargado exitosamente.', 'success');
});