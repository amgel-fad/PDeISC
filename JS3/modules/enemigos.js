// modules/enemigos.js
import { pacman, TILE_SIZE } from './jugadores.js';
import { TIPO } from './niveles.js';
import { agregarCharco } from './charcos.js';
import { getBolsas } from './bolsas.js';

let mapRef = null;

export function setMap(map) {
    mapRef = map;
}

export function resetearBombas() {
    // No se usa
}

export function crearEnemigos(configuracion, velocidades) {
    const enemigos = [];
    const spawns = [
        { x: 9, y: 10 },
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 8, y: 11 },
        { x: 12, y: 11 }
    ];
    let idx = 0;
    let contadorAmbulancias = 0;
    configuracion.forEach(item => {
        for (let i = 0; i < item.cantidad; i++) {
            let spawn;
            if (item.tipo === TIPO.AMBULANCIA) {
                spawn = { x: 19, y: 20 };
                contadorAmbulancias++;
            } else {
                spawn = spawns[idx % spawns.length];
                idx++;
            }
            const enemigo = {
                x: spawn.x,
                y: spawn.y,
                pixelX: spawn.x * TILE_SIZE,
                pixelY: spawn.y * TILE_SIZE,
                speed: velocidades[item.tipo] || 2,
                dirX: 0,
                dirY: -1,
                angle: 0,
                tipo: item.tipo,
                persiguiendo: false,
                tiempoPersecucion: 0,
                cooldownPersecucion: 0,
                puedeUsarTunel: (item.tipo === TIPO.AMBULANCIA),
                detenido: false,
                tiempoDetenido: 0,
                tiempoParaDetenerse: 7000,
                duracionDetenido: 3000,
                contadorCiclo: 0,
                generaVidas: (item.tipo === TIPO.AMBULANCIA && contadorAmbulancias === 1),
                tiempoSiguienteCharco: 0,
                intervaloCharco: 7000,
                esPayaso: (item.tipo === TIPO.PAYASO)
            };
            enemigos.push(enemigo);
        }
    });
    return enemigos;
}

export function actualizarEnemigos(enemigos, nivelConfig) {
    enemigos.forEach(enemigo => {
        if (!mapRef) return;
        switch (enemigo.tipo) {
            case TIPO.NORMAL:
                moverNormal(enemigo);
                break;
            case TIPO.EXPERIMENTADO:
                moverExperimentado(enemigo);
                break;
            case TIPO.AMBULANCIA:
                moverAmbulancia(enemigo);
                break;
            case TIPO.AUTOBUS:
                moverAutobus(enemigo);
                break;
            case TIPO.REMIS:
                moverRemis(enemigo);
                break;
            case TIPO.BOMBERO:
                moverBombero(enemigo);
                break;
            case TIPO.PAYASO:
                moverPayaso(enemigo);
                break;
        }
    });
}

// ---- MOVIMIENTO BASE ----
function moverEnemigoBase(enemigo, puedeUsarTunel = false) {
    const map = mapRef;
    if (!map) return;

    if (puedeUsarTunel) {
        const limiteIzquierdo = 0;
        const limiteDerecho = (map[0].length - 1) * TILE_SIZE;
        if (enemigo.pixelX < limiteIzquierdo) {
            enemigo.x = map[0].length - 1;
            enemigo.pixelX = enemigo.x * TILE_SIZE;
            enemigo.dirX = -1;
        } else if (enemigo.pixelX > limiteDerecho) {
            enemigo.x = 0;
            enemigo.pixelX = enemigo.x * TILE_SIZE;
            enemigo.dirX = 1;
        }
    }

    const targetX = enemigo.x * TILE_SIZE;
    const targetY = enemigo.y * TILE_SIZE;

    if (Math.abs(enemigo.pixelX - targetX) < enemigo.speed) {
        enemigo.pixelX = targetX;
    }
    if (Math.abs(enemigo.pixelY - targetY) < enemigo.speed) {
        enemigo.pixelY = targetY;
    }

    if (enemigo.pixelX === targetX && enemigo.pixelY === targetY) {
        const opciones = [];
        const dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
        dirs.forEach(dir => {
            let checkX = enemigo.x + dir.dx;
            let checkY = enemigo.y + dir.dy;
            if (!puedeUsarTunel) {
                if (checkX < 0 || checkX >= map[0].length) return;
            }
            if (map[checkY] && map[checkY][checkX] !== 1) {
                opciones.push(dir);
            }
        });

        if (opciones.length === 0) return;

        const sinRetroceso = opciones.filter(d => !(d.dx === -enemigo.dirX && d.dy === -enemigo.dirY));
        const elegida = sinRetroceso.length > 0
            ? sinRetroceso[Math.floor(Math.random() * sinRetroceso.length)]
            : opciones[Math.floor(Math.random() * opciones.length)];
        enemigo.dirX = elegida.dx;
        enemigo.dirY = elegida.dy;
        enemigo.x += enemigo.dirX;
        enemigo.y += enemigo.dirY;
    }

    if (enemigo.pixelX < enemigo.x * TILE_SIZE) enemigo.pixelX += enemigo.speed;
    if (enemigo.pixelX > enemigo.x * TILE_SIZE) enemigo.pixelX -= enemigo.speed;
    if (enemigo.pixelY < enemigo.y * TILE_SIZE) enemigo.pixelY += enemigo.speed;
    if (enemigo.pixelY > enemigo.y * TILE_SIZE) enemigo.pixelY -= enemigo.speed;

    if (enemigo.dirX === -1) enemigo.angle = 0;
    if (enemigo.dirX === 1)  enemigo.angle = Math.PI;
    if (enemigo.dirY === -1) enemigo.angle = Math.PI / 2;
    if (enemigo.dirY === 1)  enemigo.angle = -Math.PI / 2;
}

// ---- MOVIMIENTOS ESPECÍFICOS ----
function moverNormal(enemigo) {
    moverEnemigoBase(enemigo, false);
}

function moverAmbulancia(enemigo) {
    moverEnemigoBase(enemigo, true);
}

function moverAutobus(enemigo) {
    moverEnemigoBase(enemigo, false);
}

function moverRemis(enemigo) {
    const map = mapRef;
    if (!map) return;
    enemigo.contadorCiclo += 16;
    if (!enemigo.detenido) {
        if (enemigo.contadorCiclo >= enemigo.tiempoParaDetenerse) {
            enemigo.detenido = true;
            enemigo.tiempoDetenido = 0;
            enemigo.contadorCiclo = 0;
        } else {
            moverEnemigoBase(enemigo, false);
        }
    } else {
        enemigo.tiempoDetenido += 16;
        if (enemigo.tiempoDetenido >= enemigo.duracionDetenido) {
            enemigo.detenido = false;
            enemigo.tiempoDetenido = 0;
            enemigo.contadorCiclo = 0;
        }
    }
}

function moverExperimentado(enemigo) {
    const map = mapRef;
    if (!map) return;
    const DISTANCIA_PERSECUCION = 8;
    const TIEMPO_PERSECUCION = 6000;
    const COOLDOWN = 8000;
    const dx = Math.abs(enemigo.x - pacman.x);
    const dy = Math.abs(enemigo.y - pacman.y);
    const distancia = dx + dy;

    if (!enemigo.persiguiendo) {
        if (enemigo.cooldownPersecucion > 0) {
            enemigo.cooldownPersecucion -= 16;
            if (enemigo.cooldownPersecucion < 0) enemigo.cooldownPersecucion = 0;
        }
        if (enemigo.cooldownPersecucion <= 0 && distancia <= DISTANCIA_PERSECUCION) {
            enemigo.persiguiendo = true;
            enemigo.tiempoPersecucion = TIEMPO_PERSECUCION;
        }
    } else {
        enemigo.tiempoPersecucion -= 16;
        if (enemigo.tiempoPersecucion <= 0) {
            enemigo.persiguiendo = false;
            enemigo.cooldownPersecucion = COOLDOWN;
        }
    }

    if (!enemigo.persiguiendo) {
        moverEnemigoBase(enemigo, false);
        return;
    }

    const centroX = enemigo.x * TILE_SIZE;
    const centroY = enemigo.y * TILE_SIZE;
    const distX = centroX - enemigo.pixelX;
    const distY = centroY - enemigo.pixelY;
    const distanciaAlCentro = Math.sqrt(distX * distX + distY * distY);

    if (distanciaAlCentro < enemigo.speed) {
        enemigo.pixelX = centroX;
        enemigo.pixelY = centroY;
        const nextStep = bfsNextStep(enemigo.x, enemigo.y, pacman.x, pacman.y, map);
        let elegida = null;
        if (nextStep) {
            elegida = { dx: nextStep.x - enemigo.x, dy: nextStep.y - enemigo.y };
        } else {
            const dirs = [
                { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
                { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
            ];
            const validas = dirs.filter(d => {
                const nx = enemigo.x + d.dx;
                const ny = enemigo.y + d.dy;
                return nx >= 0 && nx < map[0].length &&
                       ny >= 0 && ny < map.length &&
                       map[ny][nx] !== 1;
            });
            const noRetroceso = validas.filter(d => !(d.dx === -enemigo.dirX && d.dy === -enemigo.dirY));
            const candidatas = noRetroceso.length > 0 ? noRetroceso : validas;
            if (candidatas.length > 0) {
                candidatas.sort((a, b) => {
                    const da = Math.abs((enemigo.x + a.dx) - pacman.x) + Math.abs((enemigo.y + a.dy) - pacman.y);
                    const db = Math.abs((enemigo.x + b.dx) - pacman.x) + Math.abs((enemigo.y + b.dy) - pacman.y);
                    return da - db;
                });
                elegida = candidatas[0];
            }
        }

        if (elegida) {
            enemigo.dirX = elegida.dx;
            enemigo.dirY = elegida.dy;
            enemigo.x += elegida.dx;
            enemigo.y += elegida.dy;
        }
    }

    const targetX = enemigo.x * TILE_SIZE;
    const targetY = enemigo.y * TILE_SIZE;

    if (enemigo.pixelX < targetX) enemigo.pixelX = Math.min(enemigo.pixelX + enemigo.speed, targetX);
    if (enemigo.pixelX > targetX) enemigo.pixelX = Math.max(enemigo.pixelX - enemigo.speed, targetX);
    if (enemigo.pixelY < targetY) enemigo.pixelY = Math.min(enemigo.pixelY + enemigo.speed, targetY);
    if (enemigo.pixelY > targetY) enemigo.pixelY = Math.max(enemigo.pixelY - enemigo.speed, targetY);

    if (enemigo.dirX === -1) enemigo.angle = 0;
    if (enemigo.dirX === 1)  enemigo.angle = Math.PI;
    if (enemigo.dirY === -1) enemigo.angle = Math.PI / 2;
    if (enemigo.dirY === 1)  enemigo.angle = -Math.PI / 2;
}

function moverBombero(enemigo) {
    const map = mapRef;
    if (!map) return;
    moverEnemigoBase(enemigo, false);
    enemigo.tiempoSiguienteCharco += 16;
    if (enemigo.tiempoSiguienteCharco >= enemigo.intervaloCharco) {
        enemigo.tiempoSiguienteCharco = 0;
        agregarCharco(enemigo.x, enemigo.y);
    }
}

// ---- PAYASO (SOLO ROBO DE BOLSAS) ----
function moverPayaso(enemigo) {
    const map = mapRef;
    if (!map) return;
    moverEnemigoBase(enemigo, false);

    // Robo de bolsas
    const bolsas = getBolsas();
    for (let i = bolsas.length - 1; i >= 0; i--) {
        const b = bolsas[i];
        const dx = Math.abs(enemigo.pixelX - (b.c * TILE_SIZE + TILE_SIZE / 2));
        const dy = Math.abs(enemigo.pixelY - (b.r * TILE_SIZE + TILE_SIZE / 2));
        if (dx < TILE_SIZE * 0.6 && dy < TILE_SIZE * 0.6) {
            const bolsaRobada = bolsas.splice(i, 1)[0];
            setTimeout(() => {
                const caminables = obtenerCeldasCaminables(map);
                if (caminables.length > 0) {
                    const pos = caminables[Math.floor(Math.random() * caminables.length)];
                    bolsas.push({ r: pos.y, c: pos.x });
                }
            }, 7000);
            break;
        }
    }
}

function bfsNextStep(startX, startY, goalX, goalY, map) {
    if (startX === goalX && startY === goalY) return null;
    const cols = map[0].length;
    const rows = map.length;
    const visited = new Uint8Array(cols * rows);
    const prev = new Int32Array(cols * rows).fill(-1);
    const idx = (x, y) => y * cols + x;
    const queue = [idx(startX, startY)];
    visited[idx(startX, startY)] = 1;
    const dirs = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
    ];
    let found = false;
    while (queue.length > 0) {
        const cur = queue.shift();
        const cx = cur % cols;
        const cy = Math.floor(cur / cols);
        if (cx === goalX && cy === goalY) { found = true; break; }
        for (const { dx, dy } of dirs) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
            if (map[ny][nx] === 1) continue;
            const ni = idx(nx, ny);
            if (visited[ni]) continue;
            visited[ni] = 1;
            prev[ni] = cur;
            queue.push(ni);
        }
    }
    if (!found) return null;
    let cur = idx(goalX, goalY);
    let next = cur;
    const startIdx = idx(startX, startY);
    while (prev[cur] !== startIdx && prev[cur] !== -1) {
        next = cur;
        cur = prev[cur];
    }
    if (prev[cur] === startIdx) next = cur;
    return { x: next % cols, y: Math.floor(next / cols) };
}

function obtenerCeldasCaminables(map) {
    const celdas = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] !== 1) celdas.push({ x, y });
        }
    }
    return celdas;
}