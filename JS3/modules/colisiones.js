// modules/colisiones.js
import { TILE_SIZE } from './jugadores.js';

let explosion = null;
const EXPLOSION_DURACION = 200;

export function triggerExplosion(pixelX, pixelY) {
    explosion = {
        x: pixelX + TILE_SIZE / 2,
        y: pixelY + TILE_SIZE / 2,
        inicio: performance.now()
    };
}

export function getExplosion() {
    if (!explosion) return null;
    const elapsed = performance.now() - explosion.inicio;
    if (elapsed > EXPLOSION_DURACION) {
        explosion = null;
        return null;
    }
    return explosion;
}

export function verificarColisiones(jugadores, enemigos, onPerderVida) {
    let colision = false;
    enemigos.forEach(enemigo => {
        jugadores.forEach(jugador => {
            if (!jugador.activo) return;
            if (jugador.invulnerable) return;
            const dx = Math.abs(jugador.pixelX - enemigo.pixelX);
            const dy = Math.abs(jugador.pixelY - enemigo.pixelY);
            if (dx < 20 && dy < 20) {
                colision = true;
                onPerderVida(jugador);
            }
        });
    });
    return colision;
}