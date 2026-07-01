const http = require('http');

const PORT = 3000;

// Cargar módulos con require (se cargan al inicio, no se recargan en cada petición)
const Calculo = require('./modulos/calculo.js');
const tiempo = require('./modulos/tiempo.js');

const { fechaActual, horaActual, diferenciaDias, esBisiesto } = tiempo;

const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];

    if (url === '/') {
        try {
            // Construir lista de resultados
            const resultados = [];

            // --- Cálculo ---
            resultados.push(`Suma 5 + 3 = ${Calculo.sumar(5, 3)}`);
            resultados.push(`Resta 10 - 4 = ${Calculo.restar(10, 4)}`);
            resultados.push(`Multiplicación 7 * 6 = ${Calculo.multiplicar(7, 6)}`);
            resultados.push(`División 20 / 4 = ${Calculo.dividir(20, 4)}`);
            resultados.push(`Promedio de [10, 20, 30] = ${Calculo.promedio([10, 20, 30])}`);
            resultados.push(`Factorial de 5 = ${Calculo.factorial(5)}`);

            // --- Tiempo ---
            resultados.push(`Fecha actual: ${fechaActual()}`);
            resultados.push(`Hora actual: ${horaActual()}`);
            resultados.push(`Diferencia días (2025-01-01 → 2025-12-31): ${diferenciaDias('2025-01-01', '2025-12-31')}`);
            resultados.push(`¿2024 es bisiesto? ${esBisiesto(2024)}`);
            resultados.push(`¿2023 es bisiesto? ${esBisiesto(2023)}`);

            const output = resultados.join('\n');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(output);
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error al ejecutar los módulos:\n' + error.message);
        }
        return;
    }

    // Otras rutas → 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
});

server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});