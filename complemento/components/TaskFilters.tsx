import { useTask } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ArrowUpDown } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface TaskFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onCategoryChange: (categoryId?: number) => void;
}

export default function TaskFilters({ activeFilter, onFilterChange, onCategoryChange }: TaskFiltersProps) {
  const { categories, isLoading } = useTask();
  const isMobile = useMobile();
  
  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      onCategoryChange(undefined);
    } else {
      onCategoryChange(parseInt(value));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="flex-1 flex space-x-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => onFilterChange("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={activeFilter === "today" ? "default" : "outline"}
            onClick={() => onFilterChange("today")}
            size="sm"
          >
            Today
          </Button>
          <Button
            variant={activeFilter === "upcoming" ? "default" : "outline"}
            onClick={() => onFilterChange("upcoming")}
            size="sm"
          >
            Upcoming
          </Button>
          <Button
            variant={activeFilter === "overdue" ? "default" : "outline"}
            onClick={() => onFilterChange("overdue")}
            size="sm"
          >
            Overdue
          </Button>
          <Button
            variant={activeFilter === "completed" ? "default" : "outline"}
            onClick={() => onFilterChange("completed")}
            size="sm"
          >
            Completed
          </Button>
        </div>
        
        <div className={`${isMobile ? 'mt-4' : 'mt-0'} flex items-center space-x-4`}>
          {isLoading ? (
            <Skeleton className="h-9 w-40" />
          ) : (
            <Select onValueChange={handleCategoryChange} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <div>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
