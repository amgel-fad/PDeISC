// modules/controles.js (SOLO UN JUGADOR)
import { TILE_SIZE, pacman, estado } from './jugadores.js';
import { map } from './mapa.js';

let controlesActivados = false;

export function setupControls(jugadores) {
    // En realidad solo necesitamos el primer jugador
    const jugador = jugadores[0];

    // ---- TECLADO ----
    window.addEventListener("keydown", (e) => {
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
            e.preventDefault();
        }

        // ---- FRENO CON ESPACIO ----
        if (e.key === ' ') {
            if (jugador && jugador.activo) {
                jugador.frenado = true;
            }
            return;
        }

        // Movimiento
        const teclas = jugador.teclas;
        switch (e.key) {
            case teclas.up:    jugador.nextDirX = 0;  jugador.nextDirY = -1; break;
            case teclas.down:  jugador.nextDirX = 0;  jugador.nextDirY = 1;  break;
            case teclas.left:  jugador.nextDirX = -1; jugador.nextDirY = 0;  break;
            case teclas.right: jugador.nextDirX = 1;  jugador.nextDirY = 0;  break;
        }
    });

    window.addEventListener("keyup", (e) => {
        if (e.key === ' ') {
            if (jugador && jugador.activo) {
                jugador.frenado = false;
            }
            e.preventDefault();
        }
    });

    // ---- CONTROLES TÁCTILES ----
    const touchControls = document.getElementById('touch-controls');
    if (touchControls) {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            touchControls.classList.add('show');
        }

        function handleTouchStart(e) {
            e.preventDefault();
            const btn = e.currentTarget;
            const dir = btn.dataset.dir;
            if (!dir || !jugador || !jugador.activo) return;
            switch (dir) {
                case 'up':    jugador.nextDirX = 0;  jugador.nextDirY = -1; break;
                case 'down':  jugador.nextDirX = 0;  jugador.nextDirY = 1;  break;
                case 'left':  jugador.nextDirX = -1; jugador.nextDirY = 0;  break;
                case 'right': jugador.nextDirX = 1;  jugador.nextDirY = 0;  break;
            }
            btn.classList.add('pressed');
        }

        function handleTouchEnd(e) {
            e.preventDefault();
            e.currentTarget.classList.remove('pressed');
        }

        document.querySelectorAll('.touch-btn').forEach(btn => {
            btn.addEventListener('touchstart', handleTouchStart, { passive: false });
            btn.addEventListener('touchend', handleTouchEnd, { passive: false });
            btn.addEventListener('touchcancel', handleTouchEnd, { passive: false });
            btn.addEventListener('mousedown', (e) => {
                const fakeEvent = { currentTarget: btn, preventDefault: () => {} };
                handleTouchStart(fakeEvent);
            });
            btn.addEventListener('mouseup', (e) => {
                const fakeEvent = { currentTarget: btn, preventDefault: () => {} };
                handleTouchEnd(fakeEvent);
            });
        });
    }

    // ---- BOTÓN DE FRENO ----
    const stopBtn = document.getElementById('btn-stop');
    if (stopBtn) {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            stopBtn.style.display = 'flex';
        }

        function startStop(e) {
            e.preventDefault();
            if (jugador && jugador.activo) jugador.frenado = true;
            stopBtn.classList.add('pressed');
        }

        function endStop(e) {
            e.preventDefault();
            if (jugador && jugador.activo) jugador.frenado = false;
            stopBtn.classList.remove('pressed');
        }

        stopBtn.addEventListener('touchstart', startStop, { passive: false });
        stopBtn.addEventListener('touchend', endStop, { passive: false });
        stopBtn.addEventListener('touchcancel', endStop, { passive: false });
        stopBtn.addEventListener('mousedown', startStop);
        stopBtn.addEventListener('mouseup', endStop);
        stopBtn.addEventListener('mouseleave', endStop);
    }

    // ---- ARRASTRE EN CANVAS ----
    const canvas = document.getElementById("canvas");
    if (canvas) {
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (!touch || !jugador || !jugador.activo) return;
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const dx = x - centerX;
            const dy = y - centerY;
            if (Math.abs(dx) > Math.abs(dy)) {
                jugador.nextDirX = dx > 0 ? 1 : -1;
                jugador.nextDirY = 0;
            } else {
                jugador.nextDirX = 0;
                jugador.nextDirY = dy > 0 ? 1 : -1;
            }
        }, { passive: false });

        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (!touch || !jugador || !jugador.activo) return;
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const dx = x - centerX;
            const dy = y - centerY;
            if (Math.abs(dx) > Math.abs(dy)) {
                jugador.nextDirX = dx > 0 ? 1 : -1;
                jugador.nextDirY = 0;
            } else {
                jugador.nextDirX = 0;
                jugador.nextDirY = dy > 0 ? 1 : -1;
            }
        }, { passive: false });

        canvas.addEventListener("touchend", (e) => { e.preventDefault(); }, { passive: false });
    }

    controlesActivados = true;
}