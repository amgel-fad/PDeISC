// CLASE con getters y setters (campos privados + validación)
export default class Tarea {
  #id;
  #titulo;
  #completada;
  #creada;
//validacion de caracteres 3 y 80 xd
  constructor(id, titulo, completada = false) {
    this.#id = id;
    this.titulo = titulo;          // usa el setter (valida)
    this.completada = completada;  // usa el setter
    this.#creada = new Date().toISOString();
  }

  get id() { return this.#id; }

  get titulo() { return this.#titulo; }
  set titulo(valor) {
    const limpio = String(valor ?? "").trim();
    if (limpio.length < 3) throw new Error("El título debe tener al menos 3 caracteres");
    if (limpio.length > 80) throw new Error("El título no puede superar los 80 caracteres");
    this.#titulo = limpio;
  }

  get completada() { return this.#completada; }
  set completada(valor) { this.#completada = Boolean(valor); }

  get creada() { return this.#creada; }

  alternar() { this.#completada = !this.#completada; }

  // los campos privados
  toJSON() {
    return { id: this.#id, titulo: this.#titulo, completada: this.#completada, creada: this.#creada };
  }
}
