const nombres = ["Lucas", "Sofía", "Mateo"];

// Recorremos el array y saludamos a cada persona
nombres.forEach(nombre => {
    console.log(`¡Hola, ${nombre}! Bienvenido.`);
});

/* Resultado en consola:
¡Hola, Lucas! Bienvenido.
¡Hola, Sofía! Bienvenido.
¡Hola, Mateo! Bienvenido.
*/

const numeros = [5, 12, 20, 35];

// Multiplicamos cada número por 2 dentro del bucle
numeros.forEach(numero => {
    console.log(`El doble de ${numero} es ${numero * 2}`);
});

/* Resultado en consola:
El doble de 5 es 10
El doble de 12 es 24
El doble de 20 es 40
El doble de 35 es 70
*/

const usuarios = [
    { nombre: "Ana", edad: 25 },
    { nombre: "Carlos", edad: 32 },
    { nombre: "Lucía", edad: 19 }
];

// Accedemos a las propiedades de cada objeto 'usuario'
usuarios.forEach(usuario => {
    console.log(`${usuario.nombre} tiene ${usuario.edad} años.`);
});

/* Resultado en consola:
Ana tiene 25 años.
Carlos tiene 32 años.
Lucía tiene 19 años.
*/