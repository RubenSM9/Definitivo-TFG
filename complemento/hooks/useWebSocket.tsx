import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Task, Category } from '@shared/schema';

type TaskStats = {
  total: number;
  inProgress: number;
  overdue: number;
  completed: number;
};

type TaskContextType = {
  tasks: Task[];
  categories: Category[];
  stats: TaskStats;
  isLoading: boolean;
  createTask: (task: any) => void;
  updateTask: (id: number, task: any) => void;
  deleteTask: (id: number) => void;
  filterTasks: (filter: string, categoryId?: number) => Task[];
};

const defaultStats: TaskStats = {
  total: 0,
  inProgress: 0,
  overdue: 0,
  completed: 0
};

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  categories: [],
  stats: defaultStats,
  isLoading: true,
  createTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  filterTasks: () => []
});

export function TaskProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<TaskStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Connect to WebSocket server
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data.type);

        switch (data.type) {
          case 'INITIAL_DATA':
            setTasks(data.payload.tasks);
            setCategories(data.payload.categories);
            setStats(data.payload.stats);
            setIsLoading(false);
            break;
          
          case 'TASKS_UPDATED':
            setTasks(data.payload.tasks);
            setStats(data.payload.stats);
            break;
          
          case 'NEW_NOTIFICATIONS':
            // Handled by NotificationProvider
            break;
          
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Could not connect to server. Real-time updates unavailable.',
        variant: 'destructive'
      });
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
      // Try to reconnect after 5 seconds
      setTimeout(() => {
        toast({
          title: 'Reconnecting',
          description: 'Attempting to reconnect to server...'
        });
      }, 5000);
    };

    // Clean up on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [toast]);

  // Helper functions to interact with WebSocket
  const sendMessage = (type: string, payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket is not connected');
      toast({
        title: 'Connection Error',
        description: 'Not connected to server. Please refresh the page.',
        variant: 'destructive'
      });
    }
  };

  const createTask = (task: any) => {
    sendMessage('CREATE_TASK', task);
    toast({
      title: 'Task Created',
      description: 'Your task has been created successfully.',
    });
  };

  const updateTask = (id: number, task: any) => {
    sendMessage('UPDATE_TASK', { id, ...task });
    toast({
      title: 'Task Updated',
      description: 'Your task has been updated successfully.',
    });
  };

  const deleteTask = (id: number) => {
    sendMessage('DELETE_TASK', { id });
    toast({
      title: 'Task Deleted',
      description: 'Your task has been deleted successfully.',
    });
  };

  const filterTasks = (filter: string, categoryId?: number): Task[] => {
    if (!tasks.length) return [];

    let filteredTasks = [...tasks];
    
    // Apply category filter if provided
    if (categoryId) {
      filteredTasks = filteredTasks.filter(task => task.categoryId === categoryId);
    }
    
    // Apply time-based filter
    switch (filter) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return filteredTasks.filter(task => {
          if (!task.deadline) return false;
          const deadline = new Date(task.deadline);
          return deadline >= today && deadline < tomorrow;
        });
      
      case 'upcoming':
        const now = new Date();
        return filteredTasks.filter(task => {
          if (!task.deadline) return false;
          const deadline = new Date(task.deadline);
          return deadline > now && task.status !== 'completed';
        });
      
      case 'overdue':
        const currentTime = new Date();
        return filteredTasks.filter(task => {
          if (!task.deadline) return false;
          const deadline = new Date(task.deadline);
          return deadline < currentTime && task.status !== 'completed';
        });
        
      case 'completed':
        return filteredTasks.filter(task => task.status === 'completed');
        
      case 'pending':
        return filteredTasks.filter(task => task.status === 'pending');
        
      case 'in_progress':
        return filteredTasks.filter(task => task.status === 'in_progress');
        
      default:
        return filteredTasks;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        stats,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        filterTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}