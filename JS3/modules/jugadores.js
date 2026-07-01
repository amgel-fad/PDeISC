// modules/jugadores.js
export const TILE_SIZE = 28;

export const pacman = {
    x: 1,
    y: 1,
    pixelX: 1 * TILE_SIZE,
    pixelY: 1 * TILE_SIZE,
    speed: 2,
    dirX: 0,
    dirY: 0,
    nextDirX: 0,
    nextDirY: 0,
    angle: Math.PI,
    vidas: 3,
    bolsas: 0,
    activo: true,
    imagen: 'autoo',
    invulnerable: false,
    tiempoInvulnerable: 0,
    speedOriginal: 2,
    ralentizado: false,
    tiempoRalentizacion: 0,
    frenado: false
};

export const estado = {
    vidas: 3,
    bolsasRecogidas: 0,
    bolsasMeta: 10,
    juegoTerminado: false,
    ganaste: false,
    nivelActual: 1,
    maxNivelDesbloqueado: 1
};