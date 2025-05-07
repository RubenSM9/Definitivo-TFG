import { useState } from "react";
import { useTask } from "@/hooks/useWebSocket.tsx";
import { Home, Briefcase, School, Heart, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  onSelectCategory: (id?: number) => void;
  activeCategory?: number;
}

export default function Sidebar({ onSelectCategory, activeCategory }: SidebarProps) {
  const { categories, tasks, isLoading } = useTask();
  
  // Count tasks by category
  const getCategoryTaskCount = (categoryId?: number) => {
    if (!categoryId) return tasks.length;
    return tasks.filter(task => task.categoryId === categoryId).length;
  };
  
  // Icons for categories - mapping between category name and icon
  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName.toLowerCase()) {
      case 'work':
        return <Briefcase className="mr-3 text-gray-500" size={20} />;
      case 'studies':
        return <School className="mr-3 text-gray-500" size={20} />;
      case 'personal':
        return <Heart className="mr-3 text-gray-500" size={20} />;
      default:
        return <Briefcase className="mr-3 text-gray-500" size={20} />;
    }
  };

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="w-64 flex flex-col border-r border-gray-200 bg-white">
        <div className="px-4 py-5">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          <div className="mt-4 space-y-2">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(undefined);
              }}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeCategory === undefined 
                  ? 'bg-primary bg-opacity-10 text-primary' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="mr-3 text-primary" size={20} />
              <span>All tasks</span>
              <Badge className="ml-auto text-xs" variant={activeCategory === undefined ? "default" : "secondary"}>
                {isLoading ? '...' : getCategoryTaskCount()}
              </Badge>
            </a>
            
            {isLoading ? (
              <div className="space-y-2 mt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              categories.map((category) => (
                <a 
                  key={category.id}
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory(category.id);
                  }}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeCategory === category.id 
                      ? 'bg-primary bg-opacity-10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getCategoryIcon(category.name)}
                  <span>{category.name}</span>
                  <Badge className="ml-auto text-xs" variant={activeCategory === category.id ? "default" : "secondary"}>
                    {getCategoryTaskCount(category.id)}
                  </Badge>
                </a>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 px-4">
          <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Project</Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Meeting</Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Follow-up</Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Urgent</Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Ideas</Badge>
          </div>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Current plan</p>
              <p className="text-xs text-gray-500">Premium</p>
            </div>
            <button className="ml-auto p-1 rounded-full text-gray-400 hover:text-gray-500">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
