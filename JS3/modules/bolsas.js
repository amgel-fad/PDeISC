// modules/bolsas.js
import { TILE_SIZE, estado } from './jugadores.js';
import { obtenerCeldasCaminables, map } from './mapa.js';
import { playSound } from './audio.js'; // <-- NUEVO

let bolsas = [];
let BOLSAS_META = 10;
let oleadas = [];
let indiceOleada = 0;

export function getBolsas() {
    return bolsas;
}

export function inicializarBolsas(meta, secuenciaOleadas = null) {
    bolsas = [];
    BOLSAS_META = meta;
    indiceOleada = 0;

    if (secuenciaOleadas && secuenciaOleadas.length > 0) {
        oleadas = secuenciaOleadas.slice();
        const cantidad = Math.min(oleadas[indiceOleada], BOLSAS_META);
        if (cantidad > 0) {
            generarBolsasAleatorias(cantidad);
        }
    } else {
        const BOLSAS_FIJAS = [
            { r: 1,  c: 1  },
            { r: 1,  c: 19 },
            { r: 20, c: 1  },
            { r: 20, c: 19 }
        ];
        bolsas = BOLSAS_FIJAS.map(b => ({ ...b }));
    }
}

function generarBolsasAleatorias(cantidad) {
    const caminables = obtenerCeldasCaminables();
    if (caminables.length === 0) return;
    let intentos = 0;
    while (bolsas.length < cantidad && intentos < 1000) {
        intentos++;
        const pos = caminables[Math.floor(Math.random() * caminables.length)];
        if (!bolsas.some(b => b.r === pos.r && b.c === pos.c)) {
            bolsas.push({ r: pos.r, c: pos.c });
        }
    }
}

export function checkRecogerBolsaModo1(jugador) {
    for (let i = bolsas.length - 1; i >= 0; i--) {
        const b = bolsas[i];
        const bPixelX = b.c * TILE_SIZE;
        const bPixelY = b.r * TILE_SIZE;
        if (Math.abs(jugador.pixelX - bPixelX) < TILE_SIZE * 0.6 &&
            Math.abs(jugador.pixelY - bPixelY) < TILE_SIZE * 0.6) {
            bolsas.splice(i, 1);
            jugador.bolsas++;
            // <-- NUEVO: Sonido de moneda
            playSound('coin');
            if (jugador.bolsas >= BOLSAS_META) {
                return 'meta_bolsas';
            }
            if (bolsas.length === 0) {
                indiceOleada++;
                if (indiceOleada < oleadas.length) {
                    const cantidad = Math.min(oleadas[indiceOleada], BOLSAS_META - jugador.bolsas);
                    if (cantidad > 0) {
                        generarBolsasAleatorias(cantidad);
                    }
                }
            }
            return 'recogida';
        }
    }
    return null;
}