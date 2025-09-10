import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

function TodoList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  //  Agregar tarea
  const addTask = async (e) => {
    if (e.key === "Enter" && task.trim()) {
      const nuevaTarea = {
        userId: 1,
        title: task.trim(),
        completed: false
      };

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaTarea)
        });
        const data = await res.json();
        setTasks([...tasks, { ...data, id: Date.now() }]); // id simulado
        setTask("");
      } catch (err) {
        console.error("Error al agregar tarea:", err);
      }
    }
  };

  //  Marcar tarea como hecha/no hecha
  const toggleDone = async (id) => {
    const tarea = tasks.find((t) => t.id === id);
    const actualizada = { ...tarea, completed: !tarea.completed };

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizada)
      });
      setTasks(tasks.map((t) => (t.id === id ? actualizada : t)));
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  //  Eliminar tarea
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Mi lista de tareas (vacía al iniciar)</h3>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Escribe una tarea y presiona Enter"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={addTask}
      />

      <ul className="list-group">
        {tasks.length === 0 ? (
          <li className="list-group-item text-muted">No hay tareas</li>
        ) : (
          tasks.map((t) => (
            <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={t.completed}
                  onChange={() => toggleDone(t.id)}
                />
                <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                  {t.title}
                </span>
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => deleteTask(t.id)}>
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TodoList;
