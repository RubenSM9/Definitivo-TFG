import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useNotification } from "@/hooks/useNotifications.tsx";
import { Notification as TaskNotification } from '@shared/schema';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Home, Calendar, Briefcase, Users, Settings, LogOut } from "lucide-react";

interface HeaderProps {
  onCreateTask: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function Header({ onCreateTask, onSearch, searchQuery }: HeaderProps) {
  const isMobile = useMobile();
  const { notifications, hasUnread, markAsRead } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-primary text-2xl font-bold">Zentasker</span>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <a href="#" className="text-gray-900 font-medium">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 font-medium">Calendar</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 font-medium">Projects</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 font-medium">Team</a>
            </nav>
          </div>
          
          {!isMobile && (
            <div className="relative max-w-xs w-64">
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-gray-400">search</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            {/* Notification button */}
            <div className="relative">
              <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} className="text-gray-500" />
                    {hasUnread && (
                      <span className="notification-dot absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            <div className="bg-accent/10 rounded-full p-2">
                              <Bell size={16} className="text-accent" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="mt-1 h-auto p-0 text-xs text-primary"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No new notifications
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            
            {/* User menu */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-sm focus:outline-none p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block font-medium text-gray-700">Juan García</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings size={16} className="mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && (
        <div className="md:hidden bg-white shadow-sm border-t">
          <div className="grid grid-cols-4 text-sm">
            <a href="#" className="text-primary flex flex-col items-center py-2">
              <Home size={20} />
              <span>Dashboard</span>
            </a>
            <a href="#" className="text-gray-500 flex flex-col items-center py-2">
              <Calendar size={20} />
              <span>Calendar</span>
            </a>
            <a href="#" className="text-gray-500 flex flex-col items-center py-2">
              <Briefcase size={20} />
              <span>Projects</span>
            </a>
            <a href="#" className="text-gray-500 flex flex-col items-center py-2">
              <Users size={20} />
              <span>Team</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
