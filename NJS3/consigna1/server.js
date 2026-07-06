// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // 1. Obtener la ruta solicitada (sin query string)
    const url = req.url.split('?')[0];

    // 2. Determinar qué archivo servir
    let filePath;
    if (url === '/') {
        // Página principal → index.html
        filePath = path.join(__dirname, 'pages', 'index.html');
    } else {
        // Para cualquier otra ruta (ej: /styles/estilos.css)
        // Eliminamos la barra inicial y la tomamos como ruta relativa a la raíz del proyecto
        const relativePath = url.slice(1); // quita el primer '/'
        filePath = path.join(__dirname, relativePath);
    }

    // 3. Determinar el tipo MIME según la extensión del archivo
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    if (ext === '.html') contentType = 'text/html';
    else if (ext === '.css')  contentType = 'text/css';
    else if (ext === '.js')   contentType = 'application/javascript';
    else if (ext === '.png')  contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    // Puedes agregar más tipos si los necesitas

    // 4. Leer el archivo y enviarlo
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado → 404
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Archivo no encontrado');
            } else {
                // Error interno → 500
                res.writeHead(500);
                res.end('Error interno del servidor');
            }
            return;
        }
        // Éxito → 200 y enviamos el contenido con el tipo correcto
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// 5. Iniciar el servidor
server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📂 Sirviendo archivos desde: ${__dirname}`);
});