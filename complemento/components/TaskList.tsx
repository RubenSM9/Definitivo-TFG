import { useTask } from "@/hooks/useWebSocket";
import TaskCard from "@/components/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskListProps {
  activeFilter: string;
  activeCategory?: number;
  searchQuery: string;
}

export default function TaskList({ activeFilter, activeCategory, searchQuery }: TaskListProps) {
  const { filterTasks, isLoading } = useTask();
  
  // Get filtered tasks
  const filteredTasks = filterTasks(activeFilter, activeCategory).filter(task => {
    if (!searchQuery) return true;
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           task.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="mt-8 text-center">
        <div className="inline-block p-4 rounded-full bg-gray-100">
          <span className="material-icons text-4xl text-gray-400">task_alt</span>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchQuery 
            ? `No tasks match your search "${searchQuery}"` 
            : activeFilter === 'completed' 
              ? "You haven't completed any tasks yet"
              : "Get started by creating a new task"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
