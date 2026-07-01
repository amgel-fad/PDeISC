// modulos/calculo.js

function sumar(a, b) { return a + b; }
function restar(a, b) { return a - b; }
function multiplicar(a, b) { return a * b; }

function dividir(a, b) {
    if (b === 0) throw new Error('No se puede dividir por cero');
    return a / b;
}

function promedio(numeros) {
    if (!Array.isArray(numeros) || numeros.length === 0) {
        throw new Error('Debe ser un array no vacío');
    }
    const suma = numeros.reduce((acc, num) => acc + num, 0);
    return suma / numeros.length;
}

function factorial(n) {
    if (n < 0) throw new Error('No hay factorial de negativos');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

module.exports = {
    sumar,
    restar,
    multiplicar,
    dividir,
    promedio,
    factorial
};