const http = require('http');
const fs = require('fs');
// Importamos el módulo URL (ya viene con Node)
const { URL } = require('url');

const server = http.createServer((req, res) => {
    // 1. Construir la URL completa usando la base del servidor
    //    (necesario porque req.url solo trae la ruta, ej: "/?nombre=Juan")
    const base = `http://${req.headers.host}`;
    const urlCompleta = new URL(req.url, base);

    // 2. Extraer las partes que pide la consigna
    console.log('📡 NUEVA SOLICITUD RECIBIDA:');
    console.log('  → Host (incluye puerto):', urlCompleta.host);
    console.log('  → Hostname (sin puerto):', urlCompleta.hostname);
    console.log('  → Path (ruta completa):', urlCompleta.pathname);
    console.log('  → Ruta + Query string:', urlCompleta.pathname + urlCompleta.search);
    console.log('  → Parámetros (Query):', urlCompleta.searchParams); // Objeto iterable
    console.log('  → Puerto:', urlCompleta.port || '80/443 por defecto');
    console.log('  → Protocolo:', urlCompleta.protocol);
    console.log('----------------------------------------');

    // --- Aquí va el resto de tu lógica para servir el HTML ---
    // (El código que ya tenías para leer el index.html con fs)
    fs.readFile('./index.html', (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Error al cargar la página');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000');
});