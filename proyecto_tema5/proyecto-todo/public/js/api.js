// Capa de comunicación con el servidor. Usa FETCH y AXIOS (axios viene del <script> global).
const BASE = "/api/tareas";

// Devuelve siempre { ok, mensaje, data } para que app.js no se preocupe por el tipo de error
function normalizar(ok, cuerpo) {
  return { ok, mensaje: cuerpo?.mensaje ?? "Respuesta sin mensaje", data: cuerpo?.data ?? null };
}

// ---------- FETCH ----------
export async function obtenerTareas(filtro = "todas") {
  try {
    const res = await fetch(`${BASE}?filtro=${filtro}`);
    return normalizar(res.ok, await res.json());
  } catch {
    return { ok: false, mensaje: "No se pudo conectar con el servidor", data: null };
  }
}

export async function crearTarea(titulo) {
  try {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo })
    });
    return normalizar(res.ok, await res.json());
  } catch {
    return { ok: false, mensaje: "No se pudo conectar con el servidor", data: null };
  }
}
//api funcion xd
export async function editarTarea(id, titulo) {
  try {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo })
    });
    return normalizar(res.ok, await res.json());
  } catch {
    return { ok: false, mensaje: "No se pudo conectar con el servidor", data: null };
  }
}

// ---------- AXIOS ----------
// axios lanza excepción en códigos 4xx/5xx; la respuesta del servidor está en error.response
function errorAxios(error) {
  if (error.response) return normalizar(false, error.response.data);
  return { ok: false, mensaje: "No se pudo conectar con el servidor", data: null };
}

export async function alternarTarea(id) {
  try {
    const res = await axios.patch(`${BASE}/${id}/toggle`);
    return normalizar(true, res.data);
  } catch (error) { return errorAxios(error); }
}

export async function eliminarTarea(id) {
  try {
    const res = await axios.delete(`${BASE}/${id}`);
    return normalizar(true, res.data);
  } catch (error) { return errorAxios(error); }
}
