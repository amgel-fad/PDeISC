// modulos/texto.js

function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function contarLetras(texto) {
    return texto.replace(/\s/g, '').length;
}

function invertir(texto) {
    return texto.split('').reverse().join('');
}

function contarPalabras(texto) {
    return texto.trim().split(/\s+/).length;
}

module.exports = {
    capitalizar,
    contarLetras,
    invertir,
    contarPalabras
};