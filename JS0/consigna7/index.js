const animales = ["gato", "loro", "perro", "caballo"];

// Buscamos la posición de "perro"
const posicionPerro = animales.indexOf("perro");

console.log(posicionPerro); 
// Resultado: 2 (ya que está en el índice 2: 0=gato, 1=loro, 2=perro)

const numeros = [10, 20, 30, 40, 50, 60];
const buscarNumero = 50;

const indice = numeros.indexOf(buscarNumero);

if (indice !== -1) {
    console.log(`El número ${buscarNumero} está en el array, en la posición ${indice}.`);
} else {
    console.log(`El número ${buscarNumero} no se encuentra en el array.`);
}
// Resultado: El número 50 está en el array, en la posición 4.

const ciudades = ["París", "Londres", "Roma", "Tokio"];

const indiceMadrid = ciudades.indexOf("Madrid");

if (indiceMadrid !== -1) {
    console.log(`Madrid se encuentra en el índice: ${indiceMadrid}`);
} else {
    console.log("Madrid no se encuentra en el array de ciudades.");
}
// Resultado: Madrid no se encuentra en el array de ciudades.