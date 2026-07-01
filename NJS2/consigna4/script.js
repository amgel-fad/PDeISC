// index.js

// 1. Traemos el módulo que instalamos con NPM
const { upperCase } = require("upper-case");

// 2. Creamos una variable con un texto en minúsculas
const textoMinuscula = "hola, estoy usando npm y un modulo externo y agunte independiente!";

// 3. Usamos la función del módulo para transformarlo
const textoMayuscula = upperCase(textoMinuscula);

// 4. Mostramos el resultado en la consola
console.log("Texto original:", textoMinuscula);
console.log("Texto transformado:", textoMayuscula); 