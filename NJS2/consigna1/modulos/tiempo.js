// modulos/tiempo.js
function fechaActual() {
    return new Date().toLocaleDateString('es-ES');
}

function horaActual() {
    return new Date().toLocaleTimeString('es-ES');
}

function diferenciaDias(fecha1, fecha2) {
    const f1 = new Date(fecha1);
    const f2 = new Date(fecha2);
    const diff = Math.abs(f2 - f1);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function esBisiesto(anio) {
    return (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
}

module.exports = {
    fechaActual,
    horaActual,
    diferenciaDias,
    esBisiesto
};