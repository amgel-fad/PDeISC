const numeros = [4, 11, 8, 25, 3, 14];

// Solo pasan el filtro los números que sean mayores a 10
const mayoresA10 = numeros.filter(numero => numero > 10);

console.log(mayoresA10); 
// Resultado: [11, 25, 14]

const palabras = ["sol", "computadora", "casa", "javascript", "reloj"];

// Solo se quedan las palabras con una longitud estrictamente mayor a 5
const palabrasLargas = palabras.filter(palabra => palabra.length > 5);

console.log(palabrasLargas); 
// Resultado: ['computadora', 'javascript']

const usuarios = [
    { nombre: "Ana", activo: true },
    { nombre: "Carlos", activo: false },
    { nombre: "Lucía", activo: true },
    { nombre: "Mateo", activo: false }
];

// Filtramos y nos quedamos solo con los objetos donde 'activo' sea true
const usuariosActivos = usuarios.filter(usuario => usuario.activo);

console.log(usuariosActivos); 
/* Resultado:
[
  { nombre: 'Ana', activo: true },
  { nombre: 'Lucía', activo: true }
]
*/