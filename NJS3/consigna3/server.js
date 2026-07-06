const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. Servir archivos estáticos desde las carpetas style y script
//    (las rutas serán /style/... y /script/...)
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/script', express.static(path.join(__dirname, 'script')));

// 2. Ruta principal: sirve el index.html desde la carpeta page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'index.html'));
});

// 3. Manejo de 404 (opcional pero recomendado)
app.use((req, res) => {
    res.status(404).send('Archivo no encontrado');
});

// 4. Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
    console.log(`📂 Sirviendo archivos desde: ${__dirname}`);
});