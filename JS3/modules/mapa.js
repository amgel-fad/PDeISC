// modules/mapa.js
import { TILE_SIZE } from './jugadores.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
const offCtx = offscreenCanvas.getContext('2d');

// Polyfill roundRect
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        this.closePath();
        return this;
    };
}

export const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,0,1,0,1],
    [1,2,2,2,0,0,1,2,2,2,2,2,2,2,1,0,0,2,2,2,1],
    [1,1,1,1,1,0,1,2,1,1,2,1,1,2,1,0,1,1,1,1,1],
    [0,2,2,2,0,0,2,2,1,2,2,2,1,2,2,0,2,2,2,2,0],
    [1,1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1,1],
    [1,2,2,2,0,0,1,2,2,2,2,2,2,2,1,0,0,2,2,2,1],
    [1,0,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

export function celdaCaminable(r, c) {
    return map[r] && (map[r][c] === 0 || map[r][c] === 2);
}

export function obtenerCeldasCaminables() {
    const celdas = [];
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (celdaCaminable(r, c)) celdas.push({ r, c });
        }
    }
    return celdas;
}

export function dibujarMapaEstatico() {
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            let x = c * TILE_SIZE;
            let y = r * TILE_SIZE;
            if (map[r][c] === 1) {
                offCtx.fillStyle = "#2c3e50";
                offCtx.beginPath();
                offCtx.roundRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2, 4);
                offCtx.fill();
                offCtx.strokeStyle = "#34495e";
                offCtx.lineWidth = 1;
                offCtx.stroke();
                offCtx.fillStyle = (r + c) % 3 === 0 ? "#f1c40f" : "#f39c12";
                if ((r * c + 1) % 2 === 0) offCtx.fillRect(x + 5, y + 5, 5, 7);
                if ((r + c) % 2 === 0) offCtx.fillRect(x + TILE_SIZE - 10, y + 5, 5, 7);
                if ((r * 2 + c) % 3 !== 0) offCtx.fillRect(x + 5, y + 15, 5, 7);
                if ((c * 3) % 2 === 0) offCtx.fillRect(x + TILE_SIZE - 10, y + 15, 5, 7);
                if (r + 1 < map.length && (map[r + 1][c] === 0 || map[r + 1][c] === 2)) {
                    offCtx.fillStyle = "#7f8c8d";
                    offCtx.fillRect(x + (TILE_SIZE / 2) - 3, y + TILE_SIZE - 7, 6, 6);
                }
            } else {
                offCtx.fillStyle = "#1a1a1a";
                offCtx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

export function drawMap() {
    ctx.drawImage(offscreenCanvas, 0, 0);
}