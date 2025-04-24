// src/components/TaskCard.tsx

import React from 'react';
import { Task } from '../../types/types';

interface Props {
  task: Task;
}

const TaskCard: React.FC<Props> = ({ task }) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <span>{task.status}</span>
    </div>
  );
};

export default TaskCard;
