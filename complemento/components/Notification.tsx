import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNotification } from "@/hooks/useNotifications.tsx";
import { Notification as TaskNotification } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function Notification() {
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<TaskNotification | null>(null);
  const { notifications, markAsRead } = useNotification();
  
  useEffect(() => {
    // Show notification when a new one arrives
    if (notifications.length > 0 && !visible) {
      setCurrentNotification(notifications[0]);
      setVisible(true);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, visible]);
  
  // Handle dismissal
  const handleDismiss = () => {
    if (currentNotification) {
      markAsRead(currentNotification.id);
    }
    setVisible(false);
  };
  
  // Handle view
  const handleView = () => {
    if (currentNotification) {
      markAsRead(currentNotification.id);
    }
    setVisible(false);
  };
  
  // Handle postpone
  const handlePostpone = () => {
    setVisible(false);
  };
  
  if (!currentNotification) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 right-0 m-6 w-80 z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Card className="border-l-4 border-accent overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="material-icons text-accent">notifications_active</span>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">{currentNotification.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{currentNotification.message}</p>
                  <div className="mt-2 flex">
                    <Button 
                      size="sm" 
                      className="bg-accent hover:bg-accent/90"
                      onClick={handleView}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-3"
                      onClick={handlePostpone}
                    >
                      Postpone
                    </Button>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5"
                    onClick={handleDismiss}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
