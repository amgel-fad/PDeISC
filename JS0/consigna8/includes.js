const roles = ["user", "moderator", "admin", "guest"];

const esAdmin = roles.includes("admin");

console.log(esAdmin); 
// Resultado: true

const colores = ["azul", "rojo", "amarillo"];

if (colores.includes("verde")) {
    console.log("El color verde sí está en la lista.");
} else {
    console.log("El color verde no existe en la lista.");
}
// Resultado: El color verde no existe en la lista.

const numeros = [2, 4, 6, 8];
const numeroAFichas = 6; // Este número ya existe, por lo que no debería agregarse

// El signo "!" al principio significa "NO" (condición inversa)
if (!numeros.includes(numeroAFichas)) {
    numeros.push(numeroAFichas);
    console.log(`Número ${numeroAFichas} agregado con éxito.`);
} else {
    console.log(`El número ${numeroAFichas} ya existe en el array. No se agregó.`);
}

console.log(numeros); 
// Resultado: [2, 4, 6, 8] (El array no cambió)