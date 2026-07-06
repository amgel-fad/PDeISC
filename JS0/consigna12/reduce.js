const numeros = [5, 10, 15, 20];

// acum: acumulador, curr: elemento actual
const totalSuma = numeros.reduce((acum, curr) => acum + curr, 0);

console.log(totalSuma); 
// Resultado: 50

const enteros = [2, 3, 4];

// El acumulador empieza en 1
const totalMultiplicacion = enteros.reduce((acum, curr) => acum * curr, 1);

console.log(totalMultiplicacion); 
// Resultado: 24 (2 * 3 = 6 -> 6 * 4 = 24)

const carrito = [
    { producto: "Remera", precio: 25 },
    { producto: "Pantalón", precio: 50 },
    { producto: "Zapatillas", precio: 80 }
];

// Sumamos la propiedad .precio de cada objeto al acumulador
const totalCarrito = carrito.reduce((acum, item) => acum + item.precio, 0);

console.log(`Total a pagar: $${totalCarrito}`); 
// Resultado: Total a pagar: $155