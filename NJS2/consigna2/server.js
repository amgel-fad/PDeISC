// server.js - Componente que usa HTTP y FILE SYSTEM

// Importamos los módulos nativos
const http = require('http');
const fs = require('fs');
const path = require('path');

// Definimos el puerto
const PORT = 3000;

// Creamos el servidor
const server = http.createServer((req, res) => {
    // Solo respondemos a la ruta raíz "/"
    if (req.url === '/') {
        // Leemos el archivo HTML de forma asíncrona
        const filePath = path.join(__dirname, 'page', 'index.html');
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                // Si hay error al leer el archivo, respondemos con un error 500
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor al leer el archivo HTML');
                return;
            }
            // Si todo ok, enviamos el HTML con código 200
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        // Para cualquier otra ruta, respondemos 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Página no encontrada');
    }
});

// Ponemos el servidor a escuchar
server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`aguante independiente: ${path.join(__dirname, 'public', 'index.html')}`);
});