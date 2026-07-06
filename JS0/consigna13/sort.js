const numeros = [40, 1, 5, 200, 15];

// La resta (a - b) le dice a JavaScript cómo ordenar los números
numeros.sort((a, b) => a - b);

console.log(numeros); 
// Resultado: [1, 5, 15, 40, 200]

const frutas = ["plátano", "manzana", "pera", "frutilla"];

frutas.sort();

console.log(frutas); 
// Resultado: ['frutilla', 'manzana', 'pera', 'plátano']

const personas = [
    { nombre: "Ana", edad: 35 },
    { nombre: "Carlos", edad: 20 },
    { nombre: "Sofía", edad: 28 }
];

// Comparamos las edades de los objetos 'a' y 'b'
personas.sort((a, b) => a.edad - b.edad);

console.log(personas); 
/* Resultado (ordenados de menor a mayor edad):
[
  { nombre: 'Carlos', edad: 20 },
  { nombre: 'Sofía', edad: 28 },
  { nombre: 'Ana', edad: 35 }
]
*/