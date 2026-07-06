const numeros = [10, 20, 30, 40];

// Eliminamos el primer elemento (10)
numeros.shift();

console.log(numeros); 
// Resultado: [20, 30, 40]
const chat = ["Hola, ¿cómo estás?", "Todo bien, ¿y tú?", "¡Qué bueno!"];

// Eliminamos el primer mensaje de la conversación
const mensajeEliminado = chat.shift();

console.log(`Mensaje borrado: "${mensajeEliminado}"`);
// Resultado: Mensaje borrado: "Hola, ¿cómo estás?"

console.log(chat);
// Resultado: ['Todo bien, ¿y tú?', '¡Qué bueno!']

// La fila de clientes esperando
const colaClientes = ["Cliente 1: Ana", "Cliente 2: Pedro", "Cliente 3: Marta"];

console.log("Estado inicial de la cola:", colaClientes);

// Llega un cliente nuevo y se pone al final de la fila
colaClientes.push("Cliente 4: Lucas");
console.log("Llegó Lucas:", colaClientes);

// Atendemos al primero de la fila
const atendiendoA = colaClientes.shift();
console.log(`--> Atendiendo ahora a: ${atendiendoA}`);

// Verificamos cómo quedó la cola
console.log("Fila restante:", colaClientes);