// src/app/pages/TaskList.tsx
import React, { useState, useEffect } from 'react';
import { Task } from '../../types/types';
import TaskCard from './TaskCard'; // Ruta corregida para importar TaskCard desde la misma carpeta

interface Props {
  tasks: Task[]; // Aquí se espera que 'tasks' sea un array de tareas
}

const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <div>
      <h2>Lista de Tareas</h2>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
