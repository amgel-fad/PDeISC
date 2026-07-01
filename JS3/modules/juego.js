// modules/juego.js (con sonidos integrados)
import { TILE_SIZE, pacman, estado } from './jugadores.js';
import { map, dibujarMapaEstatico, drawMap } from './mapa.js';
import { niveles, TIPO } from './niveles.js';
import { 
    crearEnemigos, actualizarEnemigos, setMap,
    resetearBombas
} from './enemigos.js';
import { getBolsas, inicializarBolsas, checkRecogerBolsaModo1 } from './bolsas.js';
import { verificarColisiones, triggerExplosion, getExplosion } from './colisiones.js';
import { actualizarHUD } from './hud.js';
import { setupControls } from './controles.js';
import { actualizarCharcos, getCharcos, limpiarCharcos } from './charcos.js';
import { playGameMusic, stopAllMusic, playSound, startLevelSounds, stopLevelSounds } from './audio.js';

// ---- CARGA DE IMÁGENES ----
const playerImg = new Image(); playerImg.src = "../galeria/autoo.png";
const policeImg = new Image(); policeImg.src = "../galeria/policia2.png";
const bolsaImg = new Image(); bolsaImg.src = "../galeria/bolsa.png";
const corazonImg = new Image(); corazonImg.src = "../galeria/corazon.png";
const explosionImg = new Image(); explosionImg.src = "../galeria/explosion2.gif";
const ambulanciaImg = new Image(); ambulanciaImg.src = "../galeria/ambulancia.png";
const autobusImg = new Image(); autobusImg.src = "../galeria/autobus.png";
const remisImg = new Image(); remisImg.src = "../galeria/remis.png";
const bomberoImg = new Image(); bomberoImg.src = "../galeria/bombero.png";
const payasoImg = new Image(); payasoImg.src = "../galeria/payaso.png";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let jugador = null;
let enemigos = [];
let bolsasMeta = 10;
let loopDetenido = false;
let enExplosion = false;
let juegoIniciado = false;

// Variables del nivel 6
let vidasExtras = [];
let vidasRecolectadas = 0;
let vidasObjetivo = 0;
let tiempoSpawnVida = 0;
const INTERVALO_SPAWN_VIDA = 15000;
let ambulanciaGeneradora = null;

// ---- VIDAS EXTRAS ALEATORIAS (NIVEL 15) ----
let vidasExtraTemporales = [];
let tiempoSpawnVidaExtra = 0;
const INTERVALO_VIDA_EXTRA_DEFAULT = 15000;
const MAX_VIDAS_DEFAULT = 7;

// ---- 🌧️ LLUVIA ----
let gotas = [];
const NUM_GOTAS = 300;
const VELOCIDAD_LLUVIA = 8;

function inicializarLluvia() {
    gotas = [];
    for (let i = 0; i < NUM_GOTAS; i++) {
        gotas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            longitud: 10 + Math.random() * 20,
            velocidad: VELOCIDAD_LLUVIA + Math.random() * 4,
            opacidad: 0.3 + Math.random() * 0.4
        });
    }
}

function dibujarLluvia() {
    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (!nivel || !nivel.lluvia) return;

    ctx.save();
    if (relampagoActivo) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
    } else {
        ctx.strokeStyle = 'rgba(180, 210, 255, 0.6)';
        ctx.lineWidth = 1.5;
    }
    gotas.forEach(gota => {
        ctx.globalAlpha = gota.opacidad;
        ctx.beginPath();
        ctx.moveTo(gota.x, gota.y);
        ctx.lineTo(gota.x - 2, gota.y + gota.longitud);
        ctx.stroke();
    });
    ctx.restore();

    gotas.forEach(gota => {
        gota.y += gota.velocidad;
        if (gota.y > canvas.height) {
            gota.y = -gota.longitud;
            gota.x = Math.random() * canvas.width;
        }
    });
}

// ---- 🌩️ TORMENTA ----
let relampagoActivo = false;
let tiempoRelampago = 0;
let proximoRelampago = 0;
const DURACION_RELAMPAGO = 150;
const INTERVALO_MIN_RELAMPAGO = 3000;
const INTERVALO_MAX_RELAMPAGO = 8000;

function inicializarTormenta() {
    relampagoActivo = false;
    tiempoRelampago = 0;
    proximoRelampago = performance.now() + 2000;
}

function actualizarRelampagos() {
    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (!nivel || !nivel.tormenta) return;

    const ahora = performance.now();

    if (relampagoActivo) {
        if (ahora - tiempoRelampago > DURACION_RELAMPAGO) {
            relampagoActivo = false;
        }
        return;
    }

    if (proximoRelampago === 0) {
        proximoRelampago = ahora + INTERVALO_MIN_RELAMPAGO + Math.random() * (INTERVALO_MAX_RELAMPAGO - INTERVALO_MIN_RELAMPAGO);
    }

    if (ahora >= proximoRelampago) {
        relampagoActivo = true;
        tiempoRelampago = ahora;
        proximoRelampago = 0;
    }
}

function dibujarNiebla() {
    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (!nivel || !nivel.tormenta) return;

    if (!jugador || !jugador.activo) return;

    const radioNiebla = 5 * TILE_SIZE;
    const centroX = jugador.pixelX + TILE_SIZE / 2;
    const centroY = jugador.pixelY + TILE_SIZE / 2;

    const grad = ctx.createRadialGradient(
        centroX, centroY, 0,
        centroX, centroY, radioNiebla
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.6, 'rgba(0, 0, 20, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 30, 0.7)');

    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function dibujarRelampago() {
    if (!relampagoActivo) return;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// ---- 🌅 CLIMA ----
function dibujarClima() {
    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (!nivel) return;

    let color = null;

    switch (nivel.clima) {
        case 'tarde':
            color = 'rgba(255, 180, 50, 0.15)';
            break;
        case 'noche':
            color = 'rgba(20, 30, 80, 0.3)';
            break;
        default:
            return;
    }

    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// ---- ⏱️ TIEMPO LÍMITE ----
let tiempoRestante = 0;
let tiempoTotal = 0;
let tiempoActivo = false;
let tiempoUltimoFrame = 0;
const TIEMPO_EXTRA_POR_OLEADA = 10;
let tiempoGameOverMostrado = false;

function iniciarTemporizador(segundos) {
    tiempoTotal = segundos;
    tiempoRestante = segundos;
    tiempoActivo = true;
    tiempoUltimoFrame = performance.now();
    tiempoGameOverMostrado = false;
}

function actualizarTiempo() {
    if (!tiempoActivo) return;
    const ahora = performance.now();
    const delta = (ahora - tiempoUltimoFrame) / 1000;
    tiempoUltimoFrame = ahora;
    tiempoRestante -= delta;
    if (tiempoRestante <= 0) {
        tiempoRestante = 0;
        tiempoActivo = false;
        if (!tiempoGameOverMostrado) {
            tiempoGameOverMostrado = true;
            estado.juegoTerminado = true;
            mostrarGameOverPorTiempo();
            loopDetenido = true;
        }
    }
}

function mostrarGameOverPorTiempo() {
    const overlay = document.getElementById('gameover-overlay');
    overlay.style.display = 'flex';
    document.querySelector('#gameover-overlay p').textContent = '⏰ ¡Se acabó el tiempo!';
    document.getElementById('btn-reintentar').onclick = () => {
        overlay.style.display = 'none';
        reiniciarNivel();
    };
    document.getElementById('btn-menu-gameover').onclick = () => {
        salirAlMenu();
    };
}

setMap(map);

// ---- FUNCIONES DE MOVIMIENTO Y DIBUJO ----
function moverJugador(jugador) {
    if (!jugador.activo) return;
    if (jugador.speed < 0.5) {
        jugador.speed = 2;
        jugador.speedOriginal = 2;
        jugador.ralentizado = false;
    }
    const limiteIzquierdo = 0;
    const limiteDerecho = (map[0].length - 1) * TILE_SIZE;
    if (jugador.pixelX < limiteIzquierdo) {
        jugador.x = map[0].length - 1;
        jugador.pixelX = jugador.x * TILE_SIZE;
        jugador.dirX = -1;
    } else if (jugador.pixelX > limiteDerecho) {
        jugador.x = 0;
        jugador.pixelX = jugador.x * TILE_SIZE;
        jugador.dirX = 1;
    }
    if (jugador.pixelX === jugador.x * TILE_SIZE && jugador.pixelY === jugador.y * TILE_SIZE) {
        let nextX = jugador.x + jugador.nextDirX;
        let nextY = jugador.y + jugador.nextDirY;
        if (map[nextY] && map[nextY][nextX] !== 1) {
            jugador.dirX = jugador.nextDirX;
            jugador.dirY = jugador.nextDirY;
        }
        let desiredX = jugador.x + jugador.dirX;
        let desiredY = jugador.y + jugador.dirY;
        if (map[desiredY] && map[desiredY][desiredX] !== 1) {
            jugador.x = desiredX;
            jugador.y = desiredY;
        } else {
            jugador.dirX = 0;
            jugador.dirY = 0;
        }
    }
    const speedActual = jugador.frenado ? 0 : jugador.speed;
    if (jugador.pixelX < jugador.x * TILE_SIZE) jugador.pixelX += speedActual;
    if (jugador.pixelX > jugador.x * TILE_SIZE) jugador.pixelX -= speedActual;
    if (jugador.pixelY < jugador.y * TILE_SIZE) jugador.pixelY += speedActual;
    if (jugador.pixelY > jugador.y * TILE_SIZE) jugador.pixelY -= speedActual;
    if (jugador.dirX === 1) jugador.angle = -Math.PI / 2;
    if (jugador.dirX === -1) jugador.angle = Math.PI / 2;
    if (jugador.dirY === 1) jugador.angle = 0;
    if (jugador.dirY === -1) jugador.angle = Math.PI;
}

function drawBolsas() {
    const bolsas = getBolsas();
    const size = TILE_SIZE * 1.1;
    bolsas.forEach(b => {
        const x = b.c * TILE_SIZE + TILE_SIZE / 2 - size / 2;
        const y = b.r * TILE_SIZE + TILE_SIZE / 2 - size / 2;
        ctx.drawImage(bolsaImg, x, y, size, size);
    });
}

function drawJugador(jugador) {
    if (!jugador.activo) return;
    const sizeScale = 1.10;
    const playerSize = TILE_SIZE * sizeScale;
    ctx.save();
    ctx.translate(jugador.pixelX + TILE_SIZE / 2, jugador.pixelY + TILE_SIZE / 2);
    ctx.rotate(jugador.angle);
    ctx.drawImage(playerImg, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
    ctx.restore();
}

function drawEnemigos() {
    enemigos.forEach(e => {
        let img = policeImg;
        let sizeScale = 1.80;
        switch (e.tipo) {
            case TIPO.NORMAL: case TIPO.EXPERIMENTADO: img = policeImg; break;
            case TIPO.AMBULANCIA: img = ambulanciaImg; sizeScale = 2.2; break;
            case TIPO.AUTOBUS: img = autobusImg; break;
            case TIPO.REMIS: img = remisImg; sizeScale = 1.80; break;
            case TIPO.BOMBERO: img = bomberoImg; sizeScale = 1.80; break;
            case TIPO.PAYASO: img = payasoImg; sizeScale = 2.90; break;
            default: img = policeImg;
        }
        const enemigoSize = TILE_SIZE * sizeScale;
        ctx.save();
        ctx.translate(e.pixelX + TILE_SIZE / 2, e.pixelY + TILE_SIZE / 2);
        ctx.rotate(e.angle);
        ctx.drawImage(img, -enemigoSize / 2, -enemigoSize / 2, enemigoSize, enemigoSize);
        ctx.restore();
    });
}

function drawVidasExtras() {
    vidasExtras.forEach(v => {
        if (!v.activo) return;
        const size = TILE_SIZE * 0.8;
        const x = v.x * TILE_SIZE + TILE_SIZE / 2 - size / 2;
        const y = v.y * TILE_SIZE + TILE_SIZE / 2 - size / 2;
        ctx.drawImage(corazonImg, x, y, size, size);
    });
    vidasExtraTemporales.forEach(v => {
        if (!v.activo) return;
        const size = TILE_SIZE * 0.8;
        const x = v.x * TILE_SIZE + TILE_SIZE / 2 - size / 2;
        const y = v.y * TILE_SIZE + TILE_SIZE / 2 - size / 2;
        ctx.drawImage(corazonImg, x, y, size, size);
    });
}

function drawExplosionEffect() {
    const exp = getExplosion();
    if (exp) {
        const size = TILE_SIZE * 3.5;
        ctx.drawImage(explosionImg, exp.x - size / 2, exp.y - size / 2, size, size);
    }
}

function drawCharcos() {
    const charcos = getCharcos();
    charcos.forEach(c => {
        const x = c.x * TILE_SIZE;
        const y = c.y * TILE_SIZE;
        const grad = ctx.createRadialGradient(
            x + TILE_SIZE/2, y + TILE_SIZE/2, 2,
            x + TILE_SIZE/2, y + TILE_SIZE/2, TILE_SIZE * 0.5
        );
        grad.addColorStop(0, 'rgba(100, 200, 255, 0.7)');
        grad.addColorStop(1, 'rgba(0, 100, 200, 0.5)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, TILE_SIZE * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 150, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE/2 - 4, y + TILE_SIZE/2 - 4, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ---- OSCURIDAD (VISIÓN LIMITADA) ----
function applyDarkness() {
    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (!nivel) return;
    if (!nivel.visionLimitada && !nivel.visionRadio) return;
    
    if (!jugador || !jugador.activo) return;
    
    const radio = nivel.visionRadio || 3;
    const radioPixeles = radio * TILE_SIZE;
    const centroX = jugador.pixelX + TILE_SIZE / 2;
    const centroY = jugador.pixelY + TILE_SIZE / 2;
    
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.arc(centroX, centroY, radioPixeles, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.99)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// ---- VIDAS EXTRAS ALEATORIAS (NIVEL 15) ----
function spawnVidaExtra() {
    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (!nivel || !nivel.vidasExtrasActivo) return;
    const caminables = obtenerCeldasCaminables();
    if (caminables.length === 0) return;
    const activas = vidasExtraTemporales.filter(v => v.activo).length;
    if (activas >= 5) return;
    const pos = caminables[Math.floor(Math.random() * caminables.length)];
    vidasExtraTemporales.push({
        x: pos.x,
        y: pos.y,
        activo: true
    });
}

function recogerVidaExtraTemporal(jugador) {
    const nivel = niveles.find(n => n.id === estado.nivelActual);
    const maxVidas = nivel.vidasExtrasMaximo || MAX_VIDAS_DEFAULT;
    for (let i = vidasExtraTemporales.length - 1; i >= 0; i--) {
        const v = vidasExtraTemporales[i];
        if (!v.activo) continue;
        const dx = Math.abs(jugador.pixelX - (v.x * TILE_SIZE + TILE_SIZE / 2));
        const dy = Math.abs(jugador.pixelY - (v.y * TILE_SIZE + TILE_SIZE / 2));
        if (dx < TILE_SIZE * 0.6 && dy < TILE_SIZE * 0.6) {
            v.activo = false;
            if (jugador.vidas < maxVidas) {
                jugador.vidas++;
                actualizarHUD(jugador, bolsasMeta, vidasRecolectadas, vidasObjetivo, tiempoActivo ? tiempoRestante : null);
            }
            vidasExtraTemporales.splice(i, 1);
            return true;
        }
    }
    return false;
}

function obtenerCeldasCaminables() {
    const celdas = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] !== 1) celdas.push({ x, y });
        }
    }
    return celdas;
}

// ---- GUARDADO DE ESTADÍSTICAS ----
function guardarEstadistica(tipo, campo, incremento = 1) {
    const key = `stats_${tipo}_${campo}`;
    const actual = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, actual + incremento);
}

// ---- SALIR AL MENÚ ----
function salirAlMenu() {
    loopDetenido = true;
    juegoIniciado = false;
    enExplosion = false;
    vidasExtras = [];
    vidasRecolectadas = 0;
    tiempoSpawnVida = 0;
    vidasExtraTemporales = [];
    tiempoSpawnVidaExtra = 0;
    limpiarCharcos();
    resetearBombas();
    tiempoActivo = false;
    tiempoRestante = 0;
    tiempoGameOverMostrado = false;
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('gameover-overlay').style.display = 'none';
    document.getElementById('victoria-overlay').style.display = 'none';
    document.getElementById('btn-pausa').style.display = 'none';
    // Cerrar overlays de pausa si están abiertos
    document.getElementById('overlay-pausa').style.display = 'none';
    document.getElementById('overlay-config-pausa').style.display = 'none';
    pausaActiva = false;
    // Detener sonidos de nivel
    stopLevelSounds();
    stopAllMusic();
    if (typeof window.irAPantalla === 'function') {
        window.irAPantalla('menu-principal');
    } else {
        document.querySelectorAll('.pantalla').forEach(p => p.style.display = 'none');
        const menu = document.getElementById('menu-principal');
        if (menu) {
            menu.style.display = 'flex';
            menu.classList.add('active');
        }
    }
    estado.juegoTerminado = false;
    estado.ganaste = false;
}

// ---- GESTIÓN DE VIDAS Y COLISIONES ----
function perderVida(jugador) {
    if (enExplosion) return;
    enExplosion = true;
    triggerExplosion(jugador.pixelX, jugador.pixelY);
    setTimeout(() => {
        jugador.vidas--;
        if (jugador.vidas <= 0) {
            jugador.activo = false;
        } else {
            jugador.x = 1;
            jugador.y = 1;
            jugador.pixelX = 1 * TILE_SIZE;
            jugador.pixelY = 1 * TILE_SIZE;
            jugador.invulnerable = true;
            jugador.tiempoInvulnerable = performance.now() + 2000;
            jugador.dirX = 0;
            jugador.dirY = 0;
            jugador.nextDirX = 0;
            jugador.nextDirY = 0;
            jugador.angle = Math.PI;
            jugador.ralentizado = false;
            jugador.speed = 2;
            jugador.speedOriginal = 2;
            Object.assign(pacman, jugador);
        }
        actualizarHUD(jugador, bolsasMeta, vidasRecolectadas, vidasObjetivo, tiempoActivo ? tiempoRestante : null);
        enExplosion = false;
        if (jugador.vidas <= 0) {
            estado.juegoTerminado = true;
            guardarEstadistica('1p', 'perdidos', 1);
            guardarEstadistica('1p', 'partidas', 1);
            mostrarGameOver();
            loopDetenido = true;
        }
    }, 200);
}
window.perderVidaGlobal = perderVida;

// ---- RECOGER VIDA EXTRA (nivel 6) ----
function recogerVidaExtra(jugador) {
    for (let i = 0; i < vidasExtras.length; i++) {
        const v = vidasExtras[i];
        if (!v.activo) continue;
        const dx = Math.abs(jugador.pixelX - (v.x * TILE_SIZE + TILE_SIZE / 2));
        const dy = Math.abs(jugador.pixelY - (v.y * TILE_SIZE + TILE_SIZE / 2));
        if (dx < TILE_SIZE * 0.6 && dy < TILE_SIZE * 0.6) {
            v.activo = false;
            vidasRecolectadas++;
            jugador.vidas++;
            actualizarHUD(jugador, bolsasMeta, vidasRecolectadas, vidasObjetivo, tiempoActivo ? tiempoRestante : null);
            // Sonido de vida extra
            playSound('vida');
            return true;
        }
    }
    return false;
}

// ---- GENERAR VIDA EXTRA (nivel 6) ----
function generarVidaExtra() {
    if (!ambulanciaGeneradora) return;
    const posibles = [
        { dx: 0, dy: 0 },
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
    ];
    let pos = null;
    for (const offset of posibles) {
        const nx = ambulanciaGeneradora.x + offset.dx;
        const ny = ambulanciaGeneradora.y + offset.dy;
        if (nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length && map[ny][nx] !== 1) {
            const ocupado = vidasExtras.some(v => v.x === nx && v.y === ny && v.activo);
            if (!ocupado) {
                pos = { x: nx, y: ny };
                break;
            }
        }
    }
    if (!pos) return;
    vidasExtras.push({
        x: pos.x,
        y: pos.y,
        activo: true
    });
}

// ---- FUNCIONES DE INTERFAZ ----
function mostrarGameOver() {
    const overlay = document.getElementById('gameover-overlay');
    overlay.style.display = 'flex';
    document.querySelector('#gameover-overlay p').textContent = '💀 ¡Has perdido todas tus vidas!';
    // Sonido game over
    stopLevelSounds();
    playSound('gameover');
    document.getElementById('btn-reintentar').onclick = () => {
        overlay.style.display = 'none';
        reiniciarNivel();
    };
    document.getElementById('btn-menu-gameover').onclick = () => {
        salirAlMenu();
    };
}

function mostrarVictoria(nivel) {
    const overlay = document.getElementById('victoria-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    document.getElementById('victoria-mensaje').textContent = nivel.mensajeVictoria || '¡Nivel completado!';
    // Sonido victoria
    stopLevelSounds();
    playSound('victory');
    guardarEstadistica('1p', 'niveles', 1);
    guardarEstadistica('1p', 'partidas', 1);
    guardarEstadistica('1p', 'dinero', jugador.bolsas);
    const siguiente = nivel.id + 1;
    if (siguiente > estado.maxNivelDesbloqueado) {
        estado.maxNivelDesbloqueado = siguiente;
        localStorage.setItem('maxNivel', siguiente);
    }
    const btnSiguiente = document.getElementById('btn-siguiente-nivel');
    const btnMenu = document.getElementById('btn-menu-principal');
    const mensajeFinal = document.getElementById('victoria-mensaje-final');
    if (nivel.id === niveles.length) {
        btnSiguiente.style.display = 'none';
        if (nivel.mensajeFinal) {
            mensajeFinal.textContent = nivel.mensajeFinal;
            mensajeFinal.style.display = 'block';
        }
    } else {
        btnSiguiente.style.display = 'inline-block';
        mensajeFinal.style.display = 'none';
    }
    btnSiguiente.onclick = () => {
        overlay.style.display = 'none';
        estado.nivelActual = siguiente;
        reiniciarJuego();
        document.getElementById('menu-niveles').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';
        document.getElementById('btn-pausa').style.display = 'flex';
    };
    btnMenu.onclick = () => {
        salirAlMenu();
    };
}

function mostrarNota(nivel) {
    return new Promise((resolve) => {
        if (!nivel || !nivel.nota) {
            resolve();
            return;
        }
        const modal = document.getElementById('nota-modal');
        const texto = document.getElementById('nota-texto');
        const imagen = document.getElementById('nota-imagen');
        const boton = document.getElementById('nota-boton');
        texto.textContent = nivel.nota;
        let imgSrc = '';
        if (nivel.id === 2) imgSrc = '../galeria/policia2.png';
        else if (nivel.id === 3) imgSrc = '../galeria/ambulancia.png';
        else if (nivel.id === 4) imgSrc = '../galeria/autobus.png';
        else if (nivel.id === 5) imgSrc = '../galeria/remis.png';
        else if (nivel.id === 6) imgSrc = '../galeria/ambulancia.png';
        else if (nivel.id === 7) imgSrc = '../galeria/autobus.png';
        else if (nivel.id === 8) imgSrc = '../galeria/autobus.png';
        else if (nivel.id === 9) imgSrc = '../galeria/policia2.png';
        else if (nivel.id === 10) imgSrc = '../galeria/bombero.png';
        else if (nivel.id === 11) imgSrc = '../galeria/remis.png';
        else if (nivel.id === 12) imgSrc = '../galeria/remis.png';
        else if (nivel.id === 13) imgSrc = '../galeria/remis.png';
        else if (nivel.id === 14) imgSrc = '../galeria/autobus.png';
        else if (nivel.id === 15) imgSrc = '../galeria/payaso.png';
        imagen.src = imgSrc;
        imagen.style.display = imgSrc ? 'block' : 'none';
        modal.style.display = 'flex';
        const newBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(newBoton, boton);
        newBoton.addEventListener('click', () => {
            modal.style.display = 'none';
            resolve();
        });
        const handleKey = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                modal.style.display = 'none';
                document.removeEventListener('keydown', handleKey);
                resolve();
            }
        };
        document.addEventListener('keydown', handleKey);
    });
}

// ---- REINICIO Y GESTIÓN DE NIVELES ----
function reiniciarPosiciones() {
    jugador.x = 1;
    jugador.y = 1;
    jugador.pixelX = 1 * TILE_SIZE;
    jugador.pixelY = 1 * TILE_SIZE;
    jugador.dirX = 0;
    jugador.dirY = 0;
    jugador.nextDirX = 0;
    jugador.nextDirY = 0;
    jugador.angle = Math.PI;
    jugador.bolsas = 0;
    jugador.activo = true;
    jugador.invulnerable = true;
    jugador.tiempoInvulnerable = performance.now() + 2000;
    jugador.speedOriginal = 2;
    jugador.ralentizado = false;
    jugador.tiempoRalentizacion = 0;
    jugador.speed = 2;
    jugador.frenado = false;
    Object.assign(pacman, jugador);
}

function inicializarJugador() {
    jugador = {
        x: 1, y: 1,
        pixelX: 1 * TILE_SIZE, pixelY: 1 * TILE_SIZE,
        speed: 2,
        dirX: 0, dirY: 0,
        nextDirX: 0, nextDirY: 0,
        angle: Math.PI,
        vidas: 3,
        bolsas: 0,
        activo: true,
        invulnerable: false,
        tiempoInvulnerable: 0,
        imagen: 'autoo',
        teclas: { up: 'w', down: 's', left: 'a', right: 'd' },
        speedOriginal: 2,
        ralentizado: false,
        tiempoRalentizacion: 0,
        frenado: false
    };
    Object.assign(pacman, jugador);
}

function reiniciarNivel() {
    // Si la pausa está activa, la cerramos
    if (pausaActiva) {
        pausaActiva = false;
        document.getElementById('overlay-pausa').style.display = 'none';
        document.getElementById('overlay-config-pausa').style.display = 'none';
        loopDetenido = false;
    }

    // Detener sonidos de nivel anteriores
    stopLevelSounds();

    estado.vidas = 3;
    estado.bolsasRecogidas = 0;
    estado.juegoTerminado = false;
    estado.ganaste = false;
    loopDetenido = false;
    enExplosion = false;
    juegoIniciado = true;
    vidasExtras = [];
    vidasRecolectadas = 0;
    vidasObjetivo = 0;
    tiempoSpawnVida = 0;
    ambulanciaGeneradora = null;
    vidasExtraTemporales = [];
    tiempoSpawnVidaExtra = 0;
    limpiarCharcos();
    resetearBombas();
    tiempoActivo = false;
    tiempoRestante = 0;
    tiempoGameOverMostrado = false;

    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (nivel) {
        bolsasMeta = nivel.bolsasMeta;
        if (nivel.vidasIniciales !== undefined) jugador.vidas = nivel.vidasIniciales;
        else jugador.vidas = 3;
        if (nivel.vidasObjetivo) vidasObjetivo = nivel.vidasObjetivo;
        inicializarBolsas(nivel.bolsasMeta, nivel.oleadas);
        enemigos = crearEnemigos(nivel.enemigos, nivel.velocidades);
        if (nivel.ambulanciaGeneraVidas) {
            ambulanciaGeneradora = enemigos.find(e => e.generaVidas === true);
        }
        if (nivel.lluvia) inicializarLluvia();
        if (nivel.tormenta) inicializarTormenta();
        if (nivel.tiempoLimite) {
            iniciarTemporizador(nivel.tiempoLimite);
        }
        // Iniciar sonidos de nivel
        startLevelSounds(nivel.id);
    }
    reiniciarPosiciones();
    actualizarHUD(jugador, bolsasMeta, vidasRecolectadas, vidasObjetivo, tiempoActivo ? tiempoRestante : null);
    if (!loopDetenido) gameLoop();
}

async function reiniciarJuego() {
    // Si la pausa está activa, la cerramos
    if (pausaActiva) {
        pausaActiva = false;
        document.getElementById('overlay-pausa').style.display = 'none';
        document.getElementById('overlay-config-pausa').style.display = 'none';
        loopDetenido = false;
    }

    // Detener sonidos de nivel anteriores
    stopLevelSounds();

    estado.juegoTerminado = false;
    estado.ganaste = false;
    loopDetenido = false;
    enExplosion = false;
    juegoIniciado = false;
    vidasExtras = [];
    vidasRecolectadas = 0;
    vidasObjetivo = 0;
    tiempoSpawnVida = 0;
    ambulanciaGeneradora = null;
    vidasExtraTemporales = [];
    tiempoSpawnVidaExtra = 0;
    limpiarCharcos();
    resetearBombas();
    tiempoActivo = false;
    tiempoRestante = 0;
    tiempoGameOverMostrado = false;

    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (nivel) {
        bolsasMeta = nivel.bolsasMeta;
        if (nivel.vidasIniciales !== undefined) jugador.vidas = nivel.vidasIniciales;
        else jugador.vidas = 3;
        if (nivel.vidasObjetivo) vidasObjetivo = nivel.vidasObjetivo;
        inicializarBolsas(nivel.bolsasMeta, nivel.oleadas);
        enemigos = crearEnemigos(nivel.enemigos, nivel.velocidades);
        if (nivel.ambulanciaGeneraVidas) {
            ambulanciaGeneradora = enemigos.find(e => e.generaVidas === true);
        }
        if (nivel.lluvia) inicializarLluvia();
        if (nivel.tormenta) inicializarTormenta();
        if (nivel.tiempoLimite) {
            iniciarTemporizador(nivel.tiempoLimite);
        }
        // Iniciar sonidos de nivel
        startLevelSounds(nivel.id);
    }
    reiniciarPosiciones();
    actualizarHUD(jugador, bolsasMeta, vidasRecolectadas, vidasObjetivo, tiempoActivo ? tiempoRestante : null);
    await mostrarNota(nivel);
    juegoIniciado = true;
    if (!loopDetenido) gameLoop();
}

// ---- BUCLE PRINCIPAL ----
function update() {
    if (estado.juegoTerminado || enExplosion) return;
    actualizarTiempo();
    const ahora = performance.now();
    if (jugador.invulnerable && ahora >= jugador.tiempoInvulnerable) {
        jugador.invulnerable = false;
    }
    const nivel = niveles.find(n => n.id === estado.nivelActual);
    if (jugador.activo) {
        let sobreCharco = false;
        const charcos = getCharcos();
        for (let c of charcos) {
            const dx = Math.abs(jugador.pixelX - (c.x * TILE_SIZE + TILE_SIZE / 2));
            const dy = Math.abs(jugador.pixelY - (c.y * TILE_SIZE + TILE_SIZE / 2));
            if (dx < TILE_SIZE * 0.6 && dy < TILE_SIZE * 0.6) {
                sobreCharco = true;
                break;
            }
        }
        if (sobreCharco && !jugador.ralentizado) {
            jugador.ralentizado = true;
            jugador.tiempoRalentizacion = 3000;
            jugador.speedOriginal = jugador.speedOriginal || 2;
            jugador.speed = jugador.speedOriginal * 0.5;
            if (jugador.speed < 0.5) jugador.speed = 0.5;
        }
        if (jugador.ralentizado) {
            jugador.tiempoRalentizacion -= 16;
            if (jugador.tiempoRalentizacion <= 0) {
                jugador.ralentizado = false;
                jugador.speed = 2;
                jugador.speedOriginal = 2;
                const centroX = jugador.x * TILE_SIZE;
                const centroY = jugador.y * TILE_SIZE;
                jugador.pixelX = centroX;
                jugador.pixelY = centroY;
            }
        }
    }
    moverJugador(jugador);
    actualizarCharcos(16);
    if (nivel && nivel.ambulanciaGeneraVidas && ambulanciaGeneradora && ambulanciaGeneradora.activo !== false) {
        tiempoSpawnVida += 16;
        if (tiempoSpawnVida >= INTERVALO_SPAWN_VIDA) {
            tiempoSpawnVida = 0;
            generarVidaExtra();
        }
    }
    if (nivel && nivel.ambulanciaGeneraVidas) {
        recogerVidaExtra(jugador);
    }

    // ---- VIDAS EXTRAS ALEATORIAS (NIVEL 15) ----
    if (nivel && nivel.vidasExtrasActivo) {
        const intervalo = nivel.vidasExtrasIntervalo ? nivel.vidasExtrasIntervalo * 1000 : INTERVALO_VIDA_EXTRA_DEFAULT;
        tiempoSpawnVidaExtra += 16;
        if (tiempoSpawnVidaExtra >= intervalo) {
            tiempoSpawnVidaExtra = 0;
            spawnVidaExtra();
        }
        recogerVidaExtraTemporal(jugador);
    }

    // ---- RECOGER BOLSAS ----
    const res = checkRecogerBolsaModo1(jugador);
    if (res === 'recogida') {
        if (getBolsas().length === 0 && tiempoActivo) {
            tiempoRestante += TIEMPO_EXTRA_POR_OLEADA;
            actualizarHUD(jugador, bolsasMeta, vidasRecolectadas, vidasObjetivo, tiempoActivo ? tiempoRestante : null);
        }
    }
    actualizarHUD(jugador, bolsasMeta, vidasRecolectadas, vidasObjetivo, tiempoActivo ? tiempoRestante : null);

    // ---- ACTUALIZAR ENEMIGOS ----
    if (nivel) actualizarEnemigos(enemigos, nivel);

    // ---- VERIFICAR COLISIONES ----
    verificarColisiones([jugador], enemigos, perderVida);

    // ---- CONDICIÓN DE VICTORIA (NIVEL 15 - SOLO BOLSAS) ----
    if (nivel && nivel.esNivelFinal && !estado.juegoTerminado && !estado.ganaste) {
        const bolsasOk = jugador.bolsas >= bolsasMeta;
        if (bolsasOk) {
            estado.ganaste = true;
            estado.juegoTerminado = true;
            mostrarVictoria(nivel);
            loopDetenido = true;
        }
    }

    // ---- CONDICIÓN DE VICTORIA (niveles normales) ----
    if (!nivel || !nivel.esNivelFinal) {
        if (!estado.juegoTerminado && !estado.ganaste) {
            const bolsasOk = jugador.bolsas >= bolsasMeta;
            let vidasOk = true;
            if (nivel && nivel.ambulanciaGeneraVidas) vidasOk = vidasRecolectadas >= vidasObjetivo;
            if (bolsasOk && vidasOk) {
                estado.ganaste = true;
                estado.juegoTerminado = true;
                mostrarVictoria(nivel);
                loopDetenido = true;
            }
        }
    }
}

function gameLoop() {
    if (loopDetenido || !juegoIniciado) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawMap();
    dibujarClima();
    actualizarRelampagos();
    dibujarNiebla();
    dibujarLluvia();
    dibujarRelampago();
    drawBolsas();
    drawJugador(jugador);
    drawEnemigos();
    drawVidasExtras();
    drawCharcos();
    drawExplosionEffect();
    applyDarkness();
    requestAnimationFrame(gameLoop);
}

// ---- FUNCIÓN DE INICIO ----
export async function iniciarJuego(nivelId = 1) {
    estado.nivelActual = nivelId;
    const nivel = niveles.find(n => n.id === nivelId);
    if (!nivel) return;

    await Promise.all([
        new Promise(r => { if (playerImg.complete) r(); else playerImg.onload = r; }),
        new Promise(r => { if (policeImg.complete) r(); else policeImg.onload = r; }),
        new Promise(r => { if (bolsaImg.complete) r(); else bolsaImg.onload = r; }),
        new Promise(r => { if (corazonImg.complete) r(); else corazonImg.onload = r; }),
        new Promise(r => { if (explosionImg.complete) r(); else explosionImg.onload = r; }),
        new Promise(r => { if (ambulanciaImg.complete) r(); else ambulanciaImg.onload = r; }),
        new Promise(r => { if (autobusImg.complete) r(); else autobusImg.onload = r; }),
        new Promise(r => { if (remisImg.complete) r(); else remisImg.onload = r; }),
        new Promise(r => { if (bomberoImg.complete) r(); else bomberoImg.onload = r; }),
        new Promise(r => { if (payasoImg.complete) r(); else payasoImg.onload = r; })
    ]);

    dibujarMapaEstatico();
    inicializarJugador();
    setupControls([jugador]);
    await reiniciarJuego();
    if (!loopDetenido && !juegoIniciado) {
        juegoIniciado = true;
        gameLoop();
    }
    // Mostrar botón de pausa
    document.getElementById('btn-pausa').style.display = 'flex';
}

// ================================================================
// ===================== PAUSA =====================================
// ================================================================
let pausaActiva = false;

export function togglePausa() {
    const overlay = document.getElementById('overlay-pausa');
    if (pausaActiva) {
        // Reanudar
        pausaActiva = false;
        overlay.style.display = 'none';
        loopDetenido = false;
        if (!estado.juegoTerminado && !estado.ganaste) {
            gameLoop();
        }
    } else {
        pausaActiva = true;
        overlay.style.display = 'flex';
        loopDetenido = true;
    }
}

export function reanudarJuego() {
    togglePausa();
}

export function abrirConfiguracionPausa() {
    document.getElementById('overlay-pausa').style.display = 'none';
    document.getElementById('overlay-config-pausa').style.display = 'flex';
    if (typeof window.actualizarBotonesToggle === 'function') {
        window.actualizarBotonesToggle();
    }
}

export function cerrarConfiguracionPausa() {
    document.getElementById('overlay-config-pausa').style.display = 'none';
    document.getElementById('overlay-pausa').style.display = 'flex';
}

// ================================================================
// ===================== EXPOSICIÓN GLOBAL ========================
// ================================================================
window.reiniciarNivel = reiniciarNivel;
window.reiniciarJuego = reiniciarJuego;
window.togglePausa = togglePausa;
window.reanudarJuego = reanudarJuego;
window.abrirConfiguracionPausa = abrirConfiguracionPausa;
window.cerrarConfiguracionPausa = cerrarConfiguracionPausa;
window.salirAlMenu = salirAlMenu;