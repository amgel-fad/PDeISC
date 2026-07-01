// modules/niveles.js
export const TIPO = {
    NORMAL: 'normal',
    EXPERIMENTADO: 'experimentado',
    AMBULANCIA: 'ambulancia',
    AUTOBUS: 'autobus',
    REMIS: 'remis',
    BOMBERO: 'bombero',
    PAYASO: 'payaso'
};

export const niveles = [
    {
        id: 1,
        nombre: 'Nivel 1',
        bolsasMeta: 10,
        oleadas: [4, 3, 3],
        enemigos: [
            { tipo: TIPO.NORMAL, cantidad: 4 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        nota: null,
        mensajeVictoria: '¡Nivel 1 completado!',
        mensajeFinal: null
    },
    {
        id: 2,
        nombre: 'Nivel 2',
        bolsasMeta: 15,
        oleadas: [5, 5, 5],
        enemigos: [
            { tipo: TIPO.NORMAL, cantidad: 5 }
           
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        nota: '¡Cuidado! Hay un auto policía que tiene mucha experiencia y enseña a los autos policía novatos a seguirte con más frecuencia, ¡estate atento!',
        mensajeVictoria: '¡Nivel 2 completado!',
        mensajeFinal: null
    },
    {
        id: 3,
        nombre: 'Nivel 3',
        bolsasMeta: 12,
        oleadas: [5, 3, 4],
        enemigos: [
            { tipo: TIPO.NORMAL, cantidad: 5 },
            { tipo: TIPO.AMBULANCIA, cantidad: 1 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2,
            ambulancia: 3.0,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        nota: 'Tenga cuidado, la ambulancia no te persigue pero es muy rapida',
        mensajeVictoria: '¡Nivel 3 completado!',
        mensajeFinal: null
    },
    {
        id: 4,
        nombre: 'Nivel 4',
        bolsasMeta: 10,
        oleadas: [4, 3, 3],
        enemigos: [
            { tipo: TIPO.NORMAL, cantidad: 5 },
            { tipo: TIPO.AMBULANCIA, cantidad: 1 },
            { tipo: TIPO.AUTOBUS, cantidad: 2 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 3.0,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        clima: 'noche',
        nota: 'Hay un caos en la ciudad, el chofer tiene mucho sueño y conduce lento.',
        mensajeVictoria: '¡Nivel 4 completado!',
        mensajeFinal: null
    },
    {
        id: 5,
        nombre: 'Nivel 5',
        bolsasMeta: 12,
        oleadas: [3, 5, 2, 2],
        enemigos: [
            { tipo: TIPO.NORMAL, cantidad: 4 },
            { tipo: TIPO.REMIS, cantidad: 4 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 3.0,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        nota: '¡Cuidado! Los remises se detienen de repente para recoger pasajeros, bloqueando el camino.',
        mensajeVictoria: '¡Nivel 5 completado!',
        mensajeFinal: null
    },
    {
        id: 6,
        nombre: 'Nivel 6',
        bolsasMeta: 10,
        oleadas: [3, 3, 4],
        enemigos: [
            { tipo: TIPO.AMBULANCIA, cantidad: 3 },
            { tipo: TIPO.REMIS, cantidad: 2 },
            { tipo: TIPO.NORMAL, cantidad: 1 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        vidasIniciales: 1,
        vidasObjetivo: 5,
        ambulanciaGeneraVidas: true,
        nota: '¡La ambulancia puede dejar vidas extras! Recolecta 5 para completar el nivel, pero ten cuidado, solo tienes 1 vida al inicio.',
        mensajeVictoria: '¡Nivel 6 completado! Has recolectado 10 bolsas y 5 vidas extra.',
        mensajeFinal: null
    },
    {
        id: 7,
        nombre: 'Nivel 7',
        bolsasMeta: 10,
        oleadas: [2, 3, 3, 2],
        enemigos: [
            { tipo: TIPO.NORMAL, cantidad: 3 },
            { tipo: TIPO.REMIS, cantidad: 4 },
            { tipo: TIPO.AUTOBUS, cantidad: 3 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        nota: 'Nivel normal. Recoge las 10 bolsas de dinero. ¡Cuidado con los remises y autobuses!',
        mensajeVictoria: '¡Nivel 7 completado!',
        mensajeFinal: null
    },
    {
        id: 8,
        nombre: 'Nivel 8',
        bolsasMeta: 15,
        oleadas: [4, 6, 3, 2],
        enemigos: [
            { tipo: TIPO.AUTOBUS, cantidad: 8 },
            { tipo: TIPO.AMBULANCIA, cantidad: 1 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        nota: '¡Muchos autobuses! Esquívalos y recoge las 15 bolsas.',
        mensajeVictoria: '¡Nivel 8 completado!',
        mensajeFinal: null
    },
    {
        id: 9,
        nombre: 'Nivel 9 - Sin Luz',
        bolsasMeta: 10,
        oleadas: [3, 2, 1, 1, 1, 2],
        enemigos: [
            { tipo: TIPO.AMBULANCIA, cantidad: 1 },
            { tipo: TIPO.NORMAL, cantidad: 4 },
            { tipo: TIPO.REMIS, cantidad: 2 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        visionLimitada: true,
        vidasIniciales: 3,
        ambulanciaGeneraVidas: true,
        nota: '¡Se fue la luz! Solo puedes ver 3 celdas a tu alrededor. Recoge las 10 bolsas con cuidado. Tienes 5 vidas para esta misión.',
        mensajeVictoria: '¡Nivel 9 completado! Sobreviviste a la oscuridad.',
        mensajeFinal: null
    },
    {
        id: 10,
        nombre: 'Nivel 10 - Bombero',
        bolsasMeta: 12,
        oleadas: [3, 3, 3, 3],
        enemigos: [
            { tipo: TIPO.AMBULANCIA, cantidad: 2 },
            { tipo: TIPO.BOMBERO, cantidad: 2 },
            { tipo: TIPO.REMIS, cantidad: 2 },
            { tipo: TIPO.NORMAL, cantidad: 2 },
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
         vidasIniciales: 4,
        nota: '¡Cuidado con los bomberos! Dejan charcos de agua que te ralentizan. Esquívalos o prepárate para ir más lento.',
        mensajeVictoria: '¡Nivel 10 completado! Superaste los charcos de agua.',
        mensajeFinal: null
    },

     // ========== NIVEL 11 (ACTUALIZADO: PARO DE COLECTIVOS) ==========
    {
        id: 11,
        nombre: 'Nivel 11 - Paro de Colectivos',
        bolsasMeta: 10,
        oleadas: [2, 2, 1, 2, 1, 1],
        enemigos: [
            { tipo: TIPO.REMIS, cantidad: 11 },
            { tipo: TIPO.AMBULANCIA, cantidad: 2 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        ambulanciaGeneraVidas: true,
          vidasIniciales: 5,
        tormenta: true,
           lluvia: true, 
        nota: 'Paro de colectivos. La ciudad está llena de remises (11) y solo tres ambulancias. Recoge 10 bolsas con cuidado.',
        mensajeVictoria: '¡Nivel 11 completado! Superaste el paro.',
        mensajeFinal: null
    },

{
    id: 12,
    nombre: 'Nivel 12 - Atardecer',
    bolsasMeta: 1,
    oleadas: [3, 3, 2, 2, 2],
    enemigos: [
        { tipo: TIPO.NORMAL, cantidad: 4 },
        { tipo: TIPO.BOMBERO, cantidad: 5 },
    ],
    velocidades: {
        normal: 2,
        experimentado: 2.1,
        ambulancia: 2.5,
        autobus: 1.5,
        remis: 2.06,
        bombero: 2.06
    },
    clima: 'noche',   // <--- TONO CÁLIDO (ATARDECER)
    // visionLimitada: false, // No tiene oscuridad
    nota: 'hay fuego en la ciudad',
    mensajeVictoria: '¡Nivel 12 completado! Has sobrevivido al atardecer.',
    mensajeFinal: null
},

 {
        id: 13,
        nombre: 'Nivel 13 - Contrarreloj',
        bolsasMeta: 10,
        oleadas: [2, 1, 2, 1, 3, 1],
        enemigos: [
            { tipo: TIPO.BOMBERO, cantidad: 3 },
            { tipo: TIPO.AUTOBUS, cantidad: 3 },
            { tipo: TIPO.REMIS, cantidad: 5 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
        tiempoLimite: 60, // 60 segundos = 1 minuto
        nota: '¡Contrarreloj! Tienes 1 minuto para recolectar 10 bolsas.',
        mensajeVictoria: '¡Nivel 13 completado! Ganaste contra el tiempo.',
        mensajeFinal: null
    },

      {
        id: 14,
        nombre: 'Nivel 14 - Todos Contra Todos',
        bolsasMeta: 35,
        oleadas: [10, 10, 10, 5],
        enemigos: [
            { tipo: TIPO.NORMAL, cantidad: 2 },
            { tipo: TIPO.AMBULANCIA, cantidad: 2 },
            { tipo: TIPO.BOMBERO, cantidad: 2 },
            { tipo: TIPO.REMIS, cantidad: 2 },
            { tipo: TIPO.AUTOBUS, cantidad: 2 }
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06
        },
         lluvia: true, 
        ambulanciaGeneraVidas: true,
        vidasIniciales: 3,
        nota: 'Todos los tipos de vehículos están en la calle. Recoge 35 bolsas de dinero.',
        mensajeVictoria: '¡Nivel 14 completado! Sobreviviste al caos.',
        mensajeFinal: null
    },

     {
        id: 15,
        nombre: 'Nivel 15 - El Payaso Loco',
        bolsasMeta: 32,
        oleadas: [2, 2, 2, 2, 2, 4, 1, 2, 1, 2, 5, 5, 1, 1],
        enemigos: [
            { tipo: TIPO.PAYASO, cantidad: 1 },
            { tipo: TIPO.NORMAL, cantidad: 1 },
            { tipo: TIPO.AMBULANCIA, cantidad: 1 },
            { tipo: TIPO.BOMBERO, cantidad: 1 },
            { tipo: TIPO.REMIS, cantidad: 1 },
            { tipo: TIPO.AUTOBUS, cantidad: 1 }
           
        ],
        velocidades: {
            normal: 2,
            experimentado: 2.1,
            ambulancia: 2.5,
            autobus: 1.5,
            remis: 2.06,
            bombero: 2.06,
            payaso: 3.0 // 2.5 * 0.95
        },
        esNivelFinal: true,
        vidasIniciales: 3,
        tormenta: true,
        vidasExtrasActivo: true,           // Activa la mecánica
        vidasExtrasIntervalo: 10,          // Aparece cada 10 segundos
        vidasExtrasMaximo: 7,              // Máximo de vidas que puede tener el jugador
        visionRadio: 5, 
        lluvia: true,
        nota: '¡Enfrenta al Payaso Loco!',
        mensajeVictoria: '¡Nivel 15 completado! Derrotaste al Payaso Loco.',
        mensajeFinal: '¡HAS COMPLETADO EL JUEGO! 🎉🏆'
    },

];