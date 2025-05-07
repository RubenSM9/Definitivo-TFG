import { useState } from "react";
import { Task } from "@shared/schema";
import { useTask } from "@/hooks/useWebSocket.tsx";
import { formatDistanceToNow, isPast, isToday, isTomorrow, format } from "date-fns";
import { MoreVertical, Clock, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask, categories } = useTask();
  const [checked, setChecked] = useState(task.status === 'completed');
  
  // Get category name
  const category = categories.find(c => c.id === task.categoryId);
  const categoryName = category?.name || '';
  
  // Format deadline
  const formattedDeadline = task.deadline 
    ? formatDeadline(new Date(task.deadline)) 
    : 'No deadline';

  // Format category icon
  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName.toLowerCase()) {
      case 'work':
        return 'work';
      case 'studies':
        return 'school';
      case 'personal':
        return 'favorite';
      default:
        return 'folder';
    }
  };
  
  // Get priority class for border
  const getPriorityClass = () => {
    switch(task.priority) {
      case 'high':
        return 'high-priority-border';
      case 'medium':
        return 'medium-priority-border';
      case 'low':
        return 'low-priority-border';
      default:
        return 'border-l-4 border-blue-500';
    }
  };
  
  // Get progress color class
  const getProgressClass = () => {
    switch(task.priority) {
      case 'high':
        return 'task-progress-high';
      case 'medium':
        return 'task-progress-medium';
      case 'low':
        return 'task-progress-low';
      default:
        return 'bg-blue-500';
    }
  };
  
  // Get priority label
  const getPriorityLabel = () => {
    switch(task.priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>;
    }
  };
  
  // Format deadline helper
  function formatDeadline(deadline: Date): string {
    if (isToday(deadline)) {
      return `Today, ${format(deadline, 'HH:mm')}`;
    } else if (isTomorrow(deadline)) {
      return `Tomorrow, ${format(deadline, 'HH:mm')}`;
    } else {
      return format(deadline, 'E, MMM d HH:mm');
    }
  }
  
  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setChecked(checked);
    updateTask(task.id, {
      status: checked ? 'completed' : 'pending',
      progress: checked ? 100 : task.progress
    });
  };
  
  // Handle task status change
  const handleStatusChange = (status: 'pending' | 'in_progress' | 'completed') => {
    updateTask(task.id, {
      status,
      progress: status === 'completed' ? 100 : task.progress
    });
    if (status === 'completed') {
      setChecked(true);
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };
  
  const isOverdue = task.deadline ? isPast(new Date(task.deadline)) && task.status !== 'completed' : false;

  return (
    <div className={`task-card bg-white shadow rounded-lg overflow-hidden ${getPriorityClass()}`}>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox 
              checked={checked} 
              onCheckedChange={handleCheckboxChange}
              className="h-5 w-5"
            />
            <p className={`ml-3 font-medium ${checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </p>
            <div className="ml-2">{getPriorityLabel()}</div>
          </div>
          <div className="flex items-center">
            {isOverdue && (
              <span className="material-icons text-accent animate-pulse mr-2">notifications_active</span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                  Mark as Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-gray-500">
              <Clock className="text-gray-400 mr-1" size={16} />
              {formattedDeadline}
            </p>
            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
              <span className="material-icons text-gray-400 mr-1 text-sm">{getCategoryIcon(categoryName)}</span>
              {categoryName}
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <div className="w-full bg-gray-200 rounded-full h-2 md:w-40">
              <div className={`${getProgressClass()} h-2 rounded-full`} style={{ width: `${task.progress}%` }}></div>
            </div>
            <span className="ml-2">{task.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
