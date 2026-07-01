// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir TODA la carpeta raíz como estática para que encuentre todo sin problemas
app.use(express.static(__dirname));

// CORREGIDO: La ruta raíz del navegador siempre es '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'index.html'));
});

// Manejo del error 404
app.use((req, res) => { 
    res.status(404).send('Archivo no encontrado'); 
});

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});