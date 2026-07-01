// modulos/calculo.js
class Calculo {
    static sumar(a, b) {
        return a + b;
    }
    static restar(a, b) {
        return a - b;
    }
    static multiplicar(a, b) {
        return a * b;
    }
    static dividir(a, b) {
        if (b === 0) throw new Error('No se puede dividir por cero');
        return a / b;
    }
    static promedio(numeros) {
        if (!Array.isArray(numeros) || numeros.length === 0) {
            throw new Error('Debe ser un array no vacío');
        }
        const suma = numeros.reduce((acc, num) => acc + num, 0);
        return suma / numeros.length;
    }
    static factorial(n) {
        if (n < 0) throw new Error('No hay factorial de negativos');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    }
}

module.exports = Calculo;