import Tarea from "./clases/Tarea.js";

// VECTOR (array) de instancias de la clase Tarea
class RepositorioTareas {
  #tareas = [];
  #siguienteId = 1;

  constructor() {
    this.crear("Estudiar Node.js y Express");
    this.crear("Practicar fetch y axios");
    this.crear("Entregar el proyecto final");
    this.alternar(1);
  }

  listar(filtro = "todas") {
    if (filtro === "pendientes") return this.#tareas.filter(t => !t.completada);
    if (filtro === "completadas") return this.#tareas.filter(t => t.completada);
    return [...this.#tareas];
  }

  buscar(id) { return this.#tareas.find(t => t.id === Number(id)); }

  crear(titulo) {
    const tarea = new Tarea(this.#siguienteId, titulo); // puede lanzar Error
    this.#siguienteId++;
    this.#tareas.push(tarea);
    return tarea;
  }

  actualizar(id, titulo) {
    const tarea = this.buscar(id);
    if (!tarea) return null;
    tarea.titulo = titulo;
    return tarea;
  }

  alternar(id) {
    const tarea = this.buscar(id);
    if (!tarea) return null;
    tarea.alternar();
    return tarea;
  }

  eliminar(id) {
    const i = this.#tareas.findIndex(t => t.id === Number(id));
    if (i === -1) return false;
    this.#tareas.splice(i, 1);
    return true;
  }
}

export default new RepositorioTareas();
