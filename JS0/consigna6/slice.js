const numeros = [10, 20, 30, 40, 50, 60];

// Copia desde el índice 0 hasta antes del 3
const primerosTres = numeros.slice(0, 3);

console.log(primerosTres); 
// Resultado: [10, 20, 30]

console.log(numeros); 
// El array original sigue intacto: [10, 20, 30, 40, 50, 60]

const peliculas = ["Batman", "Superman", "Spiderman", "Avengers", "Avatar", "Inception"];

// Copia desde el índice 2 ('Spiderman') hasta antes del 5 ('Avatar')
const peliculasCopia = peliculas.slice(2, 5);

console.log(peliculasCopia); 
// Resultado: ['Spiderman', 'Avengers', 'Avatar']

const productos = ["Teclado", "Mouse", "Monitor", "Auriculares", "Cámara", "Micrófono"];

// El índice -3 significa "los últimos 3 elementos"
const ultimosTres = productos.slice(-3);

console.log(ultimosTres); 
// Resultado: ['Auriculares', 'Cámara', 'Micrófono']