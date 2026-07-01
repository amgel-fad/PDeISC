// modules/audio.js
// Gestión de sonidos y música para el juego

// ---- VARIABLES GLOBALES ----
let menuMusic = null;
let gameMusic = null;
let levelSounds = {}; // para almacenar sonidos activos (lluvia, payaso, etc.)
let intervals = []; // para guardar IDs de setInterval y poder limpiarlos

// ---- INICIALIZAR AUDIOS (se llama en el primer click del usuario) ----
export function initAudio() {
    if (!menuMusic) {
        menuMusic = new Audio('../assets/menu-music.mp3');
        menuMusic.loop = true;
        menuMusic.volume = 0.4;
    }
    if (!gameMusic) {
        gameMusic = new Audio('../assets/game-music.mp3');
        gameMusic.loop = true;
        gameMusic.volume = 0.4;
    }
}

// ---- LEER CONFIGURACIÓN ----
function getConfig() {
    const raw = localStorage.getItem('thief_config');
    if (raw) {
        return JSON.parse(raw);
    }
    return { sonido: 'no', 'musica-menu': 'no', 'musica-mapa': 'no', noche: 'no' };
}

// ---- MÚSICA DEL MENÚ ----
export function playMenuMusic() {
    initAudio();
    const config = getConfig();
    const menuActivada = config['musica-menu'] === 'si';
    
    if (gameMusic && !gameMusic.paused) {
        gameMusic.pause();
        gameMusic.currentTime = 0;
    }

    if (menuActivada && menuMusic) {
        menuMusic.currentTime = 0;
        menuMusic.play().catch(e => console.log('🔇 Autoplay bloqueado'));
    } else {
        if (menuMusic) menuMusic.pause();
    }
}

// ---- MÚSICA DEL JUEGO ----
export function playGameMusic() {
    initAudio();
    const config = getConfig();
    const gameActivada = config['musica-mapa'] === 'si';
    
    if (menuMusic && !menuMusic.paused) {
        menuMusic.pause();
        menuMusic.currentTime = 0;
    }

    if (gameActivada && gameMusic) {
        gameMusic.currentTime = 0;
        gameMusic.play().catch(e => console.log('🔇 Autoplay bloqueado'));
    } else {
        if (gameMusic) gameMusic.pause();
    }
}

// ---- DETENER TODA LA MÚSICA ----
export function stopAllMusic() {
    if (menuMusic) { menuMusic.pause(); menuMusic.currentTime = 0; }
    if (gameMusic) { gameMusic.pause(); gameMusic.currentTime = 0; }
}

// ---- EFECTOS DE SONIDO (un solo disparo) ----
export function playSound(type) {
    const config = getConfig();
    if (config.sonido !== 'si') return;

    let sound = null;
    const basePath = '../assets/';
    switch (type) {
        case 'coin': sound = new Audio(basePath + 'bolsas-dinero.mp3'); break;
        case 'charco': sound = new Audio(basePath + 'charco-bombero.mp3'); break;
        case 'gameover': sound = new Audio(basePath + 'game-over.mp3'); break;
        case 'victory': sound = new Audio(basePath + 'ganaste.mp3'); break;
        case 'vida': sound = new Audio(basePath + 'vida.mp3'); break;
        default: return;
    }
    if (sound) {
        sound.volume = 0.6;
        sound.play().catch(e => console.log('🔇 Error al reproducir efecto:', e));
    }
}

// ---- INICIAR SONIDOS DE NIVEL ----
export function startLevelSounds(nivelId) {
    // Detener sonidos anteriores
    stopLevelSounds();

    const config = getConfig();
    if (config.sonido !== 'si') return; // si el sonido está desactivado, no iniciar sonidos de nivel

    // ---- LLUVIA (niveles 11, 14, 15) ----
    if (nivelId === 11 || nivelId === 15) {
        const lluvia = new Audio('../assets/lluvia11.mp3');
        lluvia.loop = true;
        lluvia.volume = 0.3;
        lluvia.play().catch(e => console.log('🔇 Error en lluvia11'));
        levelSounds.lluvia = lluvia;
    } else if (nivelId === 14) {
        const lluvia = new Audio('../assets/lluvia14.mp3');
        lluvia.loop = true;
        lluvia.volume = 0.3;
        lluvia.play().catch(e => console.log('🔇 Error en lluvia14'));
        levelSounds.lluvia = lluvia;
    }

    // ---- OSCURO (nivel 9) ----
    if (nivelId === 9) {
        const intervalId = setInterval(() => {
            const sound = new Audio('../assets/oscuro9.mp3');
            sound.volume = 0.5;
            sound.play().catch(e => console.log('🔇 Error en oscuro9'));
        }, 8000);
        intervals.push(intervalId);
    }

    // ---- POLICÍA (todos los niveles con autos normales) ----
    // Iniciamos los sonidos de policía en cualquier nivel, pero solo si hay autos normales.
    // Podemos verificar si el nivel tiene enemigos de tipo NORMAL, pero por simplicidad los activamos siempre.
    // Si no hay autos normales, no pasa nada, pero suenan igual.
    // Podríamos condicionar a que existan enemigos normales, pero no es necesario.
    // Iniciamos dos intervalos: policia cada 10s, policia2 cada 15s.
    const intervalPolicia = setInterval(() => {
        const sound = new Audio('../assets/policia.mp3');
        sound.volume = 0.4;
        sound.play().catch(e => console.log('🔇 Error en policia'));
    }, 10000);
    intervals.push(intervalPolicia);

    const intervalPolicia2 = setInterval(() => {
        const sound = new Audio('../assets/policia2.mp3');
        sound.volume = 0.4;
        sound.play().catch(e => console.log('🔇 Error en policia2'));
    }, 15000);
    intervals.push(intervalPolicia2);

    // ---- TIEMPO (nivel 13) ----
    if (nivelId === 13) {
        const tiempo = new Audio('../assets/tiempo.mp3');
        tiempo.loop = true;
        tiempo.volume = 0.4;
        tiempo.play().catch(e => console.log('🔇 Error en tiempo'));
        levelSounds.tiempo = tiempo;
    }

    // ---- PAYASO (nivel 15) ----
    if (nivelId === 15) {
        // payaso1: loop cada 48 segundos (duración del audio)
        const payaso1 = new Audio('../assets/payaso1.mp3');
        payaso1.loop = true;
        payaso1.volume = 0.6; // subir volumen
        payaso1.play().catch(e => console.log('🔇 Error en payaso1'));
        levelSounds.payaso1 = payaso1;

        // payaso2: patrón cada 7s (dos veces, luego una, etc.)
        let contador = 0; // 0 = dos veces, 1 = una vez
        const intervalPayaso2 = setInterval(() => {
            const sound = new Audio('../assets/payaso2.mp3');
            sound.volume = 0.5;
            // Reproducir según contador
            if (contador === 0) {
                // dos veces seguidas con pequeño delay
                sound.play().catch(e => console.log('🔇 Error en payaso2'));
                setTimeout(() => {
                    const sound2 = new Audio('../assets/payaso2.mp3');
                    sound2.volume = 0.5;
                    sound2.play().catch(e => console.log('🔇 Error en payaso2'));
                }, 300); // 300ms entre repeticiones
                contador = 1;
            } else {
                // una vez
                sound.play().catch(e => console.log('🔇 Error en payaso2'));
                contador = 0;
            }
        }, 7000);
        intervals.push(intervalPayaso2);
    }
}

// ---- DETENER SONIDOS DE NIVEL ----
export function stopLevelSounds() {
    // Detener sonidos en levelSounds
    if (levelSounds.lluvia) {
        levelSounds.lluvia.pause();
        levelSounds.lluvia.currentTime = 0;
        delete levelSounds.lluvia;
    }
    if (levelSounds.tiempo) {
        levelSounds.tiempo.pause();
        levelSounds.tiempo.currentTime = 0;
        delete levelSounds.tiempo;
    }
    if (levelSounds.payaso1) {
        levelSounds.payaso1.pause();
        levelSounds.payaso1.currentTime = 0;
        delete levelSounds.payaso1;
    }
    // Limpiar todos los intervalos
    intervals.forEach(id => clearInterval(id));
    intervals = [];
}

// ---- ACTUALIZAR ESTADO DE LA MÚSICA AL CAMBIAR CONFIGURACIÓN ----
export function refreshMusicState() {
    const config = getConfig();
    const menuShouldPlay = config['musica-menu'] === 'si';
    const gameShouldPlay = config['musica-mapa'] === 'si';

    if (!menuShouldPlay && menuMusic && !menuMusic.paused) {
        menuMusic.pause();
    }
    if (menuShouldPlay && menuMusic && menuMusic.paused) {
        const menuVisible = document.getElementById('menu-principal')?.classList.contains('active');
        if (menuVisible) {
            menuMusic.play().catch(e => {});
        }
    }

    if (!gameShouldPlay && gameMusic && !gameMusic.paused) {
        gameMusic.pause();
    }
    if (gameShouldPlay && gameMusic && gameMusic.paused) {
        const gameVisible = document.getElementById('game-container')?.style.display === 'flex';
        if (gameVisible) {
            gameMusic.play().catch(e => {});
        }
    }
}