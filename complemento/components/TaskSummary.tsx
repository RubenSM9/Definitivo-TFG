import { ListTodo, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TaskStatsProps {
  total: number;
  inProgress: number;
  overdue: number;
  completed: number;
}

interface TaskSummaryProps {
  stats: TaskStatsProps;
}

export default function TaskSummary({ stats }: TaskSummaryProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        icon={<ListTodo />}
        iconColor="text-primary"
        iconBgColor="bg-primary bg-opacity-10"
        title="Total tasks"
        value={stats.total}
      />
      
      <StatCard 
        icon={<Clock />}
        iconColor="text-yellow-600"
        iconBgColor="bg-yellow-100"
        title="In progress"
        value={stats.inProgress}
      />
      
      <StatCard 
        icon={<AlertTriangle />}
        iconColor="text-red-600"
        iconBgColor="bg-red-100"
        title="Overdue"
        value={stats.overdue}
      />
      
      <StatCard 
        icon={<CheckCircle />}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
        title="Completed"
        value={stats.completed}
      />
    </div>
  );
}

function StatCard({ icon, iconColor, iconBgColor, title, value }: { 
  icon: React.ReactNode;
  iconColor: string;
  iconBgColor: string;
  title: string;
  value: number;
}) {
  return (
    <Card className="bg-white">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBgColor)}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}