// modules/charcos.js
import { playSound } from './audio.js'; // <-- NUEVO

export let charcos = [];

export function agregarCharco(x, y) {
    charcos.push({
        x: x,
        y: y,
        tiempoRestante: 10000, // 10 segundos
        activo: true
    });
    // <-- NUEVO: Sonido de charco
    playSound('charco');
}

export function actualizarCharcos(delta) {
    for (let i = charcos.length - 1; i >= 0; i--) {
        const c = charcos[i];
        c.tiempoRestante -= delta;
        if (c.tiempoRestante <= 0) {
            charcos.splice(i, 1);
        }
    }
}

export function getCharcos() {
    return charcos;
}

export function limpiarCharcos() {
    charcos = [];
}