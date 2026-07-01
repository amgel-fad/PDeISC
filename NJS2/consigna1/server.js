// index.js - COMPONENTE PRINCIPAL

// 1. IMPORTAR MIS PROPIOS MÓDULOS (Esto es lo que pide la consigna)
const tiempo = require('./modulos/tiempo');
const calculo = require('./modulos/calculo');
const texto = require('./modulos/texto');

// 2. IMPORTAR MÓDULOS NATIVOS DE NODE
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ------------------------------
// DEMOSTRACIÓN EN CONSOLA (para ver que el componente funciona al ejecutarlo)
// ------------------------------
console.log('\n========== COMPONENTE PRINCIPAL EJECUTÁNDOSE ==========');
console.log('✅ Módulo Tiempo importado correctamente');
console.log('✅ Módulo Cálculo importado correctamente');
console.log('✅ Módulo Texto importado correctamente\n');

console.log('--- USANDO MÓDULO TIEMPO ---');
console.log(`Fecha actual: ${tiempo.fechaActual()}`);
console.log(`Hora actual: ${tiempo.horaActual()}`);
console.log(`Días entre 2026-01-01 y 2026-06-17: ${tiempo.diferenciaDias('2026-01-01', '2026-06-17')} días`);
console.log(`¿2024 es bisiesto? ${tiempo.esBisiesto(2024) ? 'Sí' : 'No'}`);

console.log('\n--- USANDO MÓDULO CÁLCULO ---');
console.log(`Suma 10 + 5 = ${calculo.sumar(10, 5)}`);
console.log(`Factorial de 5 = ${calculo.factorial(5)}`);
console.log(`Promedio de [2, 4, 6, 8] = ${calculo.promedio([2, 4, 6, 8])}`);

console.log('\n--- USANDO MÓDULO TEXTO (etc) ---');
console.log(`Capitalizar "juan" = ${texto.capitalizar('juan')}`);
console.log(`Invertir "NodeJS" = ${texto.invertir('NodeJS')}`);
console.log(`Palabras en "Hola mundo cruel" = ${texto.contarPalabras('Hola mundo cruel')}`);

console.log('\n========================================================\n');

// ------------------------------
// CREAR EL SERVIDOR WEB (Para interactuar desde el navegador)
// ------------------------------
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // --- RUTA: Página principal (Sirve el index.html) ---
    if (pathname === '/') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error interno del servidor');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }

    // --- RUTA: Archivos estáticos (CSS, imágenes, etc) ---
    else if (pathname.startsWith('/style/')) {
        const filePath = path.join(__dirname, 'public', pathname);
        const ext = path.extname(filePath);
        let contentType = 'text/plain';
        if (ext === '.css') contentType = 'text/css';
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Archivo no encontrado');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }

    // ------------------------------
    // 📡 APIS QUE USAN MIS MÓDULOS
    // ------------------------------

    // API 1: Tiempo
    else if (pathname === '/api/tiempo') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            fecha: tiempo.fechaActual(),
            hora: tiempo.horaActual()
        }));
    }

    // API 2: Cálculo (suma con parámetros)
    else if (pathname === '/api/suma') {
        const num1 = parseFloat(parsedUrl.query.num1) || 0;
        const num2 = parseFloat(parsedUrl.query.num2) || 0;
        const resultado = calculo.sumar(num1, num2);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            num1: num1,
            num2: num2,
            resultado: resultado
        }));
    }

    // API 3: Texto (invertir frase)
    else if (pathname === '/api/texto') {
        const frase = parsedUrl.query.frase || 'texto vacío';
        const invertida = texto.invertir(frase);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            original: frase,
            invertida: invertida
        }));
    }

    // --- Si la ruta no existe ---
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
});

// ------------------------------
// LEVANTAR EL SERVIDOR
// ------------------------------
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`   Servidor (Componente) corriendo en: http://localhost:${PORT}`);
    console.log('   Abre esa URL en tu navegador para ver la interfaz.');
    console.log('   También puedes probar las APIs directamente:');
    console.log(`   - http://localhost:${PORT}/api/tiempo`);
    console.log(`   - http://localhost:${PORT}/api/suma?num1=10&num2=20`);
    console.log(`   - http://localhost:${PORT}/api/texto?frase=HolaMundo`);
});