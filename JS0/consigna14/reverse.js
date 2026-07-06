const letras = ["A", "B", "C", "D"];

// Invertimos el orden directo del array
letras.reverse();

console.log(letras); 
// Resultado: ['D', 'C', 'B', 'A']

const numeros = [1, 2, 3, 4, 5];

numeros.reverse();

console.log(numeros); 
// Resultado: [5, 4, 3, 2, 1]

const palabra = "javascript";

// Encadenamos los métodos para dar vuelta el texto
const palabraInvertida = palabra.split("").reverse().join("");

console.log(palabraInvertida); 
// Resultado: "tpircsavaj"