// script/menu.js
import { iniciarJuego } from '../modules/juego.js';
import { estado } from '../modules/jugadores.js';
import { niveles } from '../modules/niveles.js';
import { playMenuMusic, stopAllMusic, refreshMusicState, initAudio } from '../modules/audio.js'; // <-- NUEVO

// ============================
// CARGAR NIVEL MÁXIMO DESBLOQUEADO
// ============================
const savedMax = localStorage.getItem('maxNivel');
if (savedMax) {
    estado.maxNivelDesbloqueado = parseInt(savedMax, 10);
} else {
    estado.maxNivelDesbloqueado = 1;
}

// ============================
// REFERENCIAS DOM
// ============================
const menuPrincipal = document.getElementById('menu-principal');
const pantallaConfig = document.getElementById('pantalla-configuracion');
const pantallaStats = document.getElementById('pantalla-estadisticas');
const pantallaNiveles1p = document.getElementById('pantalla-niveles-1p');
const gameContainer = document.getElementById('game-container');

const listaNiveles1p = document.getElementById('lista-niveles-1p');

// ============================
// CONFIGURACIÓN (toggles y tema)
// ============================
const opcionesConfig = {
    sonido: 'no',
    'musica-menu': 'no',
    'musica-mapa': 'no',
    noche: 'no'
};

const preferenciasGuardadas = localStorage.getItem('thief_config');
if (preferenciasGuardadas) {
    Object.assign(opcionesConfig, JSON.parse(preferenciasGuardadas));
}

function aplicarTema() {
    const body = document.body;
    if (opcionesConfig.noche === 'si') {
        body.classList.remove('tema-dia');
        body.classList.add('tema-noche');
    } else {
        body.classList.remove('tema-noche');
        body.classList.add('tema-dia');
    }
}

function guardarConfiguracion() {
    localStorage.setItem('thief_config', JSON.stringify(opcionesConfig));
    aplicarTema();
    actualizarBotonesToggle();
    // <-- NUEVO: Actualizar el estado de la música según la configuración
    refreshMusicState();
}

function actualizarBotonesToggle() {
    document.querySelectorAll('.toggle-group').forEach(group => {
        const opcion = group.dataset.opcion;
        if (!opcion) return;
        const valorActual = opcionesConfig[opcion] || 'no';
        group.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.valor === valorActual);
        });
    });
}

// Eventos de los botones toggle (se aplican a TODOS los .toggle-btn del documento)
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const group = btn.closest('.toggle-group');
        const opcion = group.dataset.opcion;
        const valor = btn.dataset.valor;
        if (opcion && valor) {
            opcionesConfig[opcion] = valor;
            guardarConfiguracion();
        }
    });
});

// Aplicar tema al cargar
aplicarTema();
actualizarBotonesToggle();

// ============================
// ESTADÍSTICAS
// ============================
function actualizarEstadisticas() {
    const stats = {
        '1p-niveles': parseInt(localStorage.getItem('stats_1p_niveles') || '0'),
        '1p-partidas': parseInt(localStorage.getItem('stats_1p_partidas') || '0'),
        '1p-dinero': parseInt(localStorage.getItem('stats_1p_dinero') || '0'),
        '1p-perdidos': parseInt(localStorage.getItem('stats_1p_perdidos') || '0')
    };
    Object.keys(stats).forEach(key => {
        const el = document.getElementById(`stats-${key}`);
        if (el) el.textContent = stats[key];
    });
}

// ============================
// NAVEGACIÓN ENTRE PANTALLAS
// ============================
function irAPantalla(id) {
    if (window._cambiandoPantalla) return;
    window._cambiandoPantalla = true;

    setTimeout(() => {
        document.querySelectorAll('.pantalla').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        const target = document.getElementById(id);
        if (target) {
            target.style.display = 'flex';
            requestAnimationFrame(() => target.classList.add('active'));
        }
        if (id === 'pantalla-estadisticas') actualizarEstadisticas();
        if (id === 'pantalla-configuracion') actualizarBotonesToggle();
        
        // <-- NUEVO: Control de música según la pantalla visible
        if (id === 'menu-principal') {
            initAudio(); // Inicializar en el primer click
            playMenuMusic();
        } else if (id === 'pantalla-niveles-1p') {
            initAudio();
            playMenuMusic();
        } else {
            stopAllMusic();
        }
        
        window._cambiandoPantalla = false;
    }, 200);
}

window.irAPantalla = irAPantalla;

// ============================
// SELECCIÓN DE NIVELES (15 botones)
// ============================
function generarBotonesNiveles(contenedor) {
    contenedor.innerHTML = '';
    const MAX_NIVELES = 15;
    for (let i = 1; i <= MAX_NIVELES; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn-nivel';
        btn.textContent = i;
        const disponible = i <= estado.maxNivelDesbloqueado;
        if (disponible) {
            btn.disabled = false;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pantalla').forEach(p => p.style.display = 'none');
                gameContainer.style.display = 'flex';
                
                // <-- NUEVO: Detener música del menú (la del juego se inicia en juego.js)
                stopAllMusic();
                iniciarJuego(i);
                document.getElementById('btn-pausa').style.display = 'flex';
            });
        } else {
            btn.disabled = true;
            btn.classList.add('bloqueado');
        }
        contenedor.appendChild(btn);
    }
}

// Inicializar lista de niveles
generarBotonesNiveles(listaNiveles1p);

// ============================
// FUNCIÓN AUXILIAR PARA SALIR AL MENÚ
// ============================
window.salirAlMenu = function() {
    document.querySelectorAll('.pantalla').forEach(p => p.style.display = 'none');
    const menu = document.getElementById('menu-principal');
    if (menu) {
        menu.style.display = 'flex';
        menu.classList.add('active');
    }
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('gameover-overlay').style.display = 'none';
    document.getElementById('victoria-overlay').style.display = 'none';
    document.getElementById('btn-pausa').style.display = 'none';
    // <-- NUEVO: Detener toda la música al volver al menú
    stopAllMusic();
    // La música del menú se reiniciará al mostrar el menú (irAPantalla)
};

// ============================
// EXPONER FUNCIONES DE CONFIGURACIÓN GLOBALMENTE
// ============================
window.actualizarBotonesToggle = actualizarBotonesToggle;
window.guardarConfiguracion = guardarConfiguracion;
window.aplicarTema = aplicarTema;
window.opcionesConfig = opcionesConfig;

// ============================
// INICIALIZAR MOSTRANDO MENÚ PRINCIPAL
// ============================
irAPantalla('menu-principal');