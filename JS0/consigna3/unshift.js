// Creamos el array vacío
const colores = [];

// Agregamos los tres colores al principio
colores.unshift("Rojo", "Verde", "Azul");

console.log(colores); 
// Resultado: ['Rojo', 'Verde', 'Azul']

const tareas = ["Lavar ropa", "Estudiar programación", "Hacer la compra"];
const nuevaTareaUrgente = "Pagar el alquiler (¡URGENTE!)";

// Usamos unshift para que quede como la primera prioridad
tareas.unshift(nuevaTareaUrgente);

console.log(tareas); 
// Resultado: [ 'Pagar el alquiler (¡URGENTE!)', 'Lavar ropa', 'Estudiar programación', 'Hacer la compra' ]

const usuariosConectados = ["user_99", "marcos_dev", "clara_12"];
const nuevoUsuario = "ale_v";

// Insertamos al nuevo usuario al inicio de la lista
usuariosConectados.unshift(nuevoUsuario);

console.log(usuariosConectados); 
// Resultado: [ 'ale_v', 'user_99', 'marcos_dev', 'clara_12' ]