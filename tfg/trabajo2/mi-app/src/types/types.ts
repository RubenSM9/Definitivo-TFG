// src/types/types.ts

// Definimos una interfaz Task para describir la estructura de una tarea
 export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
  }
  
  export interface TaskList {
    id: string;
    name: string;
    tasks: Task[];
  }