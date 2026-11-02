// Modo día / noche. Guarda SOLO la preferencia visual (no las tareas)
const CLAVE = "tema-preferido";
//tema
export function temaInicial() {
  const guardado = localStorage.getItem(CLAVE);
  if (guardado === "dark" || guardado === "light") return guardado;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function aplicarTema(tema) {
  document.documentElement.dataset.theme = tema;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema === "dark" ? "#0e1424" : "#e9edf5");
  const boton = document.getElementById("btn-tema");
  if (boton) {
    boton.setAttribute("aria-pressed", String(tema === "dark"));
    boton.setAttribute("aria-label", tema === "dark" ? "Cambiar a modo día" : "Cambiar a modo noche");
  }
}

export function iniciarTema() {
  aplicarTema(temaInicial());
  // EVENTO click: alternar tema
  document.getElementById("btn-tema").addEventListener("click", () => {
    const nuevo = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(CLAVE, nuevo);
    aplicarTema(nuevo);
  });
}
