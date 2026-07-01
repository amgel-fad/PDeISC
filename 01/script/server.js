const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Sirve la carpeta 'index' (donde está el HTML)
app.use(express.static(path.join(__dirname, '..', 'index')));

// NUEVO: Sirve la carpeta 'style' para que Express encuentre el CSS
app.use('/style', express.static(path.join(__dirname, '..', 'style')));

// NUEVO: Sirve la carpeta 'script' para que Express encuentre el JS del cliente
// (Nota: Esto expondrá funcion.js, pero también server.js, lo cual en desarrollo está bien, aunque en producción no se hace)
app.use('/script', express.static(path.join(__dirname))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
