// src/app/pages/TaskDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 

// Aquí simulo la API, pero puedes reemplazarlo con tu API real
const fetchTaskDetails = (id: number) => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: `Tarea ${id}`,
        description: `Descripción detallada de la tarea ${id}`,
        status: id % 2 === 0 ? 'Completada' : 'Pendiente',
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
      });
    }, 500);
  });
};

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID de la tarea desde la URL
  const [task, setTask] = useState<any | null>(null); // Estado para almacenar la tarea
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar la carga de datos

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchTaskDetails(Number(id)) // Simula la obtención de detalles de la tarea
        .then((data) => {
          setTask(data); // Guarda la tarea en el estado
          setLoading(false); // Cambia el estado de carga
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]); // Efecto que se ejecuta cuando el ID cambia

  if (loading) {
    return <div>Loading...</div>; // Muestra un mensaje de carga mientras se obtienen los detalles
  }

  if (!task) {
    return <div>No se encontró la tarea.</div>; // Muestra un mensaje si no hay tarea
  }

  return (
    <div className="task-details">
      <h1>{task.title}</h1>
      <p><strong>Descripción:</strong> {task.description}</p>
      <p><strong>Estado:</strong> {task.status}</p>
      <p><strong>Fecha de creación:</strong> {task.createdAt}</p>
      <p><strong>Última actualización:</strong> {task.updatedAt}</p>
      <button onClick={() => alert('¡Tarea actualizada!')}>Actualizar tarea</button>
    </div>
  );
};

export default TaskDetails;
