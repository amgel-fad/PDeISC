const numeros = [2, 5, 10, 15];

// map() toma cada número, lo multiplica por 3 y lo guarda en el nuevo array
const multiplicados = numeros.map(numero => numero * 3);

console.log(multiplicados); 
// Resultado: [6, 15, 30, 45]

console.log(numeros); 
// El original no cambia: [2, 5, 10, 15]

const nombres = ["juan", "amgelo", "pedro", "sofía"];

// Convertimos cada nombre a mayúsculas
const nombresMayusculas = nombres.map(nombre => nombre.toUpperCase());

console.log(nombresMayusculas); 
// Resultado: ['JUAN', 'MARÍA', 'PEDRO', 'SOFÍA']

const preciosSinIva = [100, 250, 50, 1200];

// Calculamos el precio final con IVA incluido
const preciosConIva = preciosSinIva.map(precio => precio * 1.21);

console.log(preciosConIva); 
// Resultado: [121, 302.5, 60.5, 1452]