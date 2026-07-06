// Creamos el array vacío
const frutas = [];

// Agregamos las tres frutas
frutas.push("Manzana", "Plátano", "Uva");

console.log(frutas); 
// Resultado: ['Manzana', 'Plátano', 'Uva']

// Array existente
const amigos = ["Carlos", "Ana"];

// Agregamos tus 3 amigos
amigos.push("Luis", "Sofía", "Diego");

console.log(amigos); 
// Resultado: ['Carlos', 'Ana', 'Luis', 'Sofía', 'Diego']

const numeros = [5, 10, 15, 20];
const nuevoNumero = 25; // Número que queremos evaluar

// Obtenemos el último número del array
const ultimoNumero = numeros[numeros.length - 1];

// Condición: solo si el nuevo es mayor que el último
if (nuevoNumero > ultimoNumero) {
    numeros.push(nuevoNumero);
    console.log("¡Número agregado con éxito!");
} else {
    console.log("El número no es mayor, no se agregó.");
}

console.log(numeros); 
// Resultado: [5, 10, 15, 20, 25]