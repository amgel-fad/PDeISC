import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import repo from "./repositorio.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const noEncontrada = (res) => res.status(404).json({ mensaje: "La tarea no existe" });

// GET /api/tareas?filtro=todas|pendientes|completadas
app.get("/api/tareas", (req, res) => {
  const tareas = repo.listar(req.query.filtro);
  res.status(200).json({ mensaje: `${tareas.length} tarea(s) encontradas`, data: tareas });
});

// POST /api/tareas
app.post("/api/tareas", (req, res) => {
  try {
    const tarea = repo.crear(req.body.titulo);
    res.status(201).json({ mensaje: "Tarea creada correctamente", data: tarea });
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
});

// PUT /api/tareas/:id
app.put("/api/tareas/:id", (req, res) => {
  try {
    const tarea = repo.actualizar(req.params.id, req.body.titulo);
    if (!tarea) return noEncontrada(res);
    res.status(200).json({ mensaje: "Tarea actualizada", data: tarea });
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
});

// PATCH /api/tareas/:id/toggle
app.patch("/api/tareas/:id/toggle", (req, res) => {
  const tarea = repo.alternar(req.params.id);
  if (!tarea) return noEncontrada(res);
  res.status(200).json({
    mensaje: tarea.completada ? "Tarea marcada como completada" : "Tarea marcada como pendiente",
    data: tarea
  });
});

// DELETE /api/tareas/:id
app.delete("/api/tareas/:id", (req, res) => {
  if (!repo.eliminar(req.params.id)) return noEncontrada(res);
  res.status(200).json({ mensaje: "Tarea eliminada" });
});

app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
