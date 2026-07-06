const letras = ["A", "B", "C", "D", "E"];

// Empezamos en el índice 1 ('B') y borramos 2 elementos ('B' y 'C')
letras.splice(1, 2);

console.log(letras); 
// Resultado: ['A', 'D', 'E']

const nombres = ["Juan", "María", "Pedro"];

// Índice 1 (segunda posición), borramos 0 elementos, insertamos 'Sofía'
nombres.splice(1, 0, "Sofía");

console.log(nombres); 
// Resultado: ['Juan', 'Sofía', 'María', 'Pedro']

const colores = ["Rojo", "Verde", "Azul", "Amarillo"];

// Empezamos en el índice 1 ('Verde'), borramos 2 elementos ('Verde' y 'Azul')
// y en su lugar metemos 'Rosa' y 'Naranja'
colores.splice(1, 2, "Rosa", "Naranja");

console.log(colores); 
// Resultado: ['Rojo', 'Rosa', 'Naranja', 'Amarillo']