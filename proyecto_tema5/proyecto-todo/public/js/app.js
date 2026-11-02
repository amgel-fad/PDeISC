// Eventos del DOM y dibujo de la interfaz
import { iniciarTema } from "./tema.js";
import { obtenerTareas, crearTarea, editarTarea, alternarTarea, eliminarTarea } from "./api.js";

const formNueva = document.getElementById("form-nueva");
const inputTitulo = document.getElementById("input-titulo");
const lista = document.getElementById("lista");
const resumen = document.getElementById("resumen");
const cajaMensaje = document.getElementById("mensaje");
const filtros = document.querySelector(".filtros");
const dialogo = document.getElementById("dialogo");
const formEditar = document.getElementById("form-editar");
const inputEditar = document.getElementById("input-editar");

let filtroActual = "todas";
let idEditando = null;
let temporizador;

function mostrarMensaje(texto, ok = true) {
  cajaMensaje.textContent = texto;
  cajaMensaje.className = ok ? "mensaje" : "mensaje error";
  cajaMensaje.hidden = false;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (cajaMensaje.hidden = true), 3500);
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function dibujar(tareas) {
  if (tareas.length === 0) {
    lista.innerHTML = `<li class="vacio">No hay tareas en esta vista. Agregá una arriba.</li>`;
    return;
  }
  lista.innerHTML = tareas.map(t => `
    <li class="tarea ${t.completada ? "hecha" : ""}" data-id="${t.id}">
      <input type="checkbox" ${t.completada ? "checked" : ""} aria-label="Completar: ${escapar(t.titulo)}">
      <span class="titulo">${escapar(t.titulo)}</span>
      <button class="icono editar" data-accion="editar">Editar</button>
      <button class="icono borrar" data-accion="borrar">Eliminar</button>
    </li>`).join("");
}

async function cargar() {
  const r = await obtenerTareas(filtroActual);
  if (!r.ok) { mostrarMensaje(r.mensaje, false); return; }
  dibujar(r.data);
  const todas = filtroActual === "todas" ? r.data : (await obtenerTareas("todas")).data ?? [];
  const hechas = todas.filter(t => t.completada).length;
  resumen.textContent = `${hechas} de ${todas.length} completadas`;
}

// EVENTO submit: pan
formNueva.addEventListener("submit", async (e) => {
  e.preventDefault();
  const r = await crearTarea(inputTitulo.value);
  mostrarMensaje(r.mensaje, r.ok);
  if (r.ok) { inputTitulo.value = ""; await cargar(); }
});

// EVENTO click: filtros
filtros.addEventListener("click", (e) => {
  const boton = e.target.closest(".filtro");
  if (!boton) return;
  filtroActual = boton.dataset.filtro;
  filtros.querySelectorAll(".filtro").forEach(b => b.classList.toggle("activo", b === boton));
  cargar();
});

// EVENTO click: editar / eliminar (delegación de eventos)
lista.addEventListener("click", async (e) => {
  const boton = e.target.closest("[data-accion]");
  if (!boton) return;
  const item = boton.closest(".tarea");
  const id = item.dataset.id;

  if (boton.dataset.accion === "editar") {
    idEditando = id;
    inputEditar.value = item.querySelector(".titulo").textContent;
    dialogo.showModal();
    inputEditar.focus();
  } else if (boton.dataset.accion === "borrar") {
    const r = await eliminarTarea(id);
    mostrarMensaje(r.mensaje, r.ok);
    await cargar();
  }
});

// EVENTO change: marcar completada / pendiente
lista.addEventListener("change", async (e) => {
  if (!e.target.matches("input[type=checkbox]")) return;
  const r = await alternarTarea(e.target.closest(".tarea").dataset.id);
  mostrarMensaje(r.mensaje, r.ok);
  await cargar();
});

// EVENTO submit: guardar edición
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();
  const r = await editarTarea(idEditando, inputEditar.value);
  mostrarMensaje(r.mensaje, r.ok);
  if (r.ok) { dialogo.close(); await cargar(); }
});

document.getElementById("cancelar-edicion").addEventListener("click", () => dialogo.close());

iniciarTema();
cargar();
