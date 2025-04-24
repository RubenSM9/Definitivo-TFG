import React from 'react';
import { TaskList as TaskListType } from '../../types/types';

interface Props {
  list: TaskListType;
}

const TaskList: React.FC<Props> = ({ list }) => {
  return (
    <div>
      <h3>{list.name}</h3>
      <ul>
        {list.tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;