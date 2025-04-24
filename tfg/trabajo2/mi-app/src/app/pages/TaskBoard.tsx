// src/components/TaskBoard.tsx

import React, { useState } from 'react';
import TaskList from './TaskList';
import { TaskList as TaskListType } from '../../types/types';

const TaskBoard: React.FC = () => {
  const [taskLists, setTaskLists] = useState<TaskListType[]>([
    {
      id: '1',
      name: 'Por hacer',
      tasks: [
        { id: '1', title: 'Tarea 1', description: 'Descripción de la tarea 1', status: 'Pendiente' },
        { id: '2', title: 'Tarea 2', description: 'Descripción de la tarea 2', status: 'Pendiente' },
      ],
    },
    {
      id: '2',
      name: 'En progreso',
      tasks: [
        { id: '3', title: 'Tarea 3', description: 'Descripción de la tarea 3', status: 'En progreso' },
      ],
    },
    {
      id: '3',
      name: 'Completadas',
      tasks: [
        { id: '4', title: 'Tarea 4', description: 'Descripción de la tarea 4', status: 'Completada' },
      ],
    },
  ]);

  return (
    <div className="task-board">
      {taskLists.map((list) => (
        <TaskList key={list.id} list={list} />
      ))}
    </div>
  );
};

export default TaskBoard;
