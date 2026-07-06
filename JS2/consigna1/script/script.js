// ===== ESTADO =====
let numeros = [];

// ===== DOM =====
const inputNumero = document.getElementById('inputNumero');
const btnAgregar = document.getElementById('btnAgregar');
const contador = document.getElementById('contador');
const mensajeEstado = document.getElementById('mensajeEstado');
const listaNumeros = document.getElementById('listaNumeros');
const btnGuardar = document.getElementById('btnGuardar');
const btnLimpiar = document.getElementById('btnLimpiar');
const mensajeGlobal = document.getElementById('mensajeGlobal');
const toggleTheme = document.getElementById('toggleTheme');
const fechaSpan = document.getElementById('fechaActual');
const climaSpan = document.getElementById('climaActual');

// ===== LÍMITE DE DÍGITOS (10) =====
inputNumero.maxLength = 10;

// ===== FILTRAR ENTIEMPO REAL =====
inputNumero.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
});

// ===== FECHA Y CLIMA (AHORA FIJO) =====
function actualizarFechaYClima() {
    // Fecha
    const ahora = new Date();
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fechaSpan.textContent = ahora.toLocaleDateString('es-ES', opciones);

    // Clima fijo con calavera
    climaSpan.innerHTML = '☁️ Clima feo 💀';
}
actualizarFechaYClima();
// Ya no es necesario actualizar cada 5 minutos, pero lo dejamos por si quieres
// setInterval(actualizarFechaYClima, 300000);

// ===== PERSISTENCIA =====
const STORAGE_KEY = 'numerosApp';

function guardarEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(numeros));
}

function cargarDesdeStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            numeros = JSON.parse(data);
            if (!Array.isArray(numeros)) numeros = [];
        } catch {
            numeros = [];
        }
    } else {
        numeros = [];
    }
}

// ===== TEMA =====
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

// ===== MENSAJES (sin alert) =====
function mostrarMensaje(texto, tipo = 'error') {
    mensajeGlobal.textContent = texto;
    mensajeGlobal.className = 'mensaje-global ' + tipo;
    clearTimeout(mensajeGlobal._timeout);
    mensajeGlobal._timeout = setTimeout(() => {
        mensajeGlobal.className = 'mensaje-global';
        mensajeGlobal.textContent = '';
    }, 5000);
}

// ===== VALIDACIÓN =====
function soloDigitos(valor) {
    return /^\d+$/.test(valor);
}

// ===== ACTUALIZAR INTERFAZ =====
function actualizarInterfaz() {
    const cantidad = numeros.length;
    contador.textContent = cantidad;

    listaNumeros.innerHTML = '';
    numeros.forEach((num, index) => {
        const span = document.createElement('span');
        span.className = 'numero-item';
        span.innerHTML = `${num} <button class="remove-btn" data-index="${index}">✕</button>`;
        listaNumeros.appendChild(span);
    });

    document.querySelectorAll('.numero-item .remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.index, 10);
            numeros.splice(idx, 1);
            guardarEnStorage();
            actualizarInterfaz();
            validarCantidad();
        });
    });

    validarCantidad();
    guardarEnStorage();
}

function validarCantidad() {
    const cantidad = numeros.length;
    if (cantidad < 10) {
        mensajeEstado.textContent = `Faltan ${10 - cantidad} números (mínimo 10)`;
        mensajeEstado.style.color = '#e74c3c';
        btnGuardar.disabled = true;
    } else if (cantidad >= 10 && cantidad <= 20) {
        mensajeEstado.textContent = '✅ Cantidad válida';
        mensajeEstado.style.color = '#27ae60';
        btnGuardar.disabled = false;
    } else if (cantidad > 20) {
        mensajeEstado.textContent = '⚠️ Máximo 20 números alcanzado';
        mensajeEstado.style.color = '#e74c3c';
        btnGuardar.disabled = true;
    }
}

// ===== EVENTOS =====
btnAgregar.addEventListener('click', () => {
    const valor = inputNumero.value.trim();
    if (valor === '') {
        mostrarMensaje('Por favor, escribe un número.', 'error');
        inputNumero.focus();
        return;
    }
    if (!soloDigitos(valor)) {
        mostrarMensaje('Solo se permiten dígitos (sin signos, comas ni puntos).', 'error');
        inputNumero.value = '';
        inputNumero.focus();
        return;
    }
    if (valor.length > 10) {
        mostrarMensaje('El número no puede tener más de 10 dígitos.', 'error');
        inputNumero.value = '';
        inputNumero.focus();
        return;
    }
    if (numeros.length >= 20) {
        mostrarMensaje('Ya has alcanzado el máximo de 20 números.', 'error');
        return;
    }

    numeros.push(Number(valor));
    actualizarInterfaz();
    inputNumero.value = '';
    inputNumero.focus();
    mostrarMensaje(`Número ${valor} agregado correctamente.`, 'success');
});

inputNumero.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        btnAgregar.click();
    }
});

btnLimpiar.addEventListener('click', () => {
    if (numeros.length === 0) {
        mostrarMensaje('No hay números para limpiar.', 'info');
        return;
    }
    numeros = [];
    actualizarInterfaz();
    btnGuardar.disabled = true;
    inputNumero.focus();
    mostrarMensaje('Lista limpiada correctamente.', 'info');
});

btnGuardar.addEventListener('click', () => {
    if (numeros.length < 10 || numeros.length > 20) {
        mostrarMensaje(`Debes tener entre 10 y 20 números (actual: ${numeros.length}).`, 'error');
        return;
    }
    const contenido = numeros.join('\n');
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'numeros_ingresados.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarMensaje('Archivo descargado exitosamente.', 'success');
});

// ===== INICIALIZACIÓN =====
cargarDesdeStorage();
actualizarInterfaz();