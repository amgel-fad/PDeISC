const animales = ["Perro", "Gato", "Elefante", "Loro"];

// Eliminamos el último (Loro)
animales.pop();

console.log(animales); 
// Resultado: ['Perro', 'Gato', 'Elefante']

const listaCompras = ["Leche", "Pan", "Huevos", "Café"];

// Eliminamos el último producto y guardamos su nombre
const productoEliminado = listaCompras.pop();

console.log(`Eliminado: ${productoEliminado}`); 
// Resultado: "Eliminado: Café"

console.log(listaCompras); 
// Resultado: ['Leche', 'Pan', 'Huevos']

const numeros = [1, 2, 3, 4, 5];

// El bucle continuará mientras "numeros.length" sea mayor que 0
while (numeros.length > 0) {
    numeros.pop();
}

console.log(numeros); 
// Resultado: [] (El array quedó completamente vacío)