import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Notification as TaskNotification } from '@shared/schema';

type NotificationContextType = {
  notifications: TaskNotification[];
  hasUnread: boolean;
  markAsRead: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  hasUnread: false,
  markAsRead: () => {}
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Add event listener for WebSocket notifications
    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'INITIAL_DATA') {
          setNotifications(data.payload.notifications || []);
          setHasUnread(data.payload.notifications?.length > 0);
        } 
        else if (data.type === 'NOTIFICATIONS_UPDATED') {
          setNotifications(data.payload.notifications || []);
          setHasUnread(data.payload.notifications?.length > 0);
        }
        else if (data.type === 'NEW_NOTIFICATIONS') {
          // Display new notifications as toasts
          data.payload.notifications.forEach((notification: TaskNotification) => {
            toast({
              title: notification.title,
              description: notification.message,
              duration: 5000,
            });
          });
        }
      } catch (error) {
        console.error('Error parsing notification message:', error);
      }
    };

    // Listen for notification messages
    window.addEventListener('message', handleWebSocketMessage);

    // Add event listener for WebSocket messages
    const originalAddEventListener = WebSocket.prototype.addEventListener;
    WebSocket.prototype.addEventListener = function(type, listener, options) {
      if (type === 'message') {
        const originalListener = listener;
        listener = function(event) {
          originalListener.call(this, event);
          handleWebSocketMessage(event);
        };
      }
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Override onmessage
    const originalOnMessage = Object.getOwnPropertyDescriptor(WebSocket.prototype, 'onmessage');
    if (originalOnMessage && originalOnMessage.set) {
      Object.defineProperty(WebSocket.prototype, 'onmessage', {
        set(handler) {
          originalOnMessage.set.call(this, function(event) {
            if (handler) handler(event);
            handleWebSocketMessage(event);
          });
        }
      });
    }

    // Request permission for browser notifications
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
      WebSocket.prototype.addEventListener = originalAddEventListener;
      if (originalOnMessage) {
        Object.defineProperty(WebSocket.prototype, 'onmessage', originalOnMessage);
      }
    };
  }, [toast]);

  // Mark notification as read
  const markAsRead = (id: number) => {
    // Find notification
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    // Send WebSocket message
    const socket = getWebSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'MARK_NOTIFICATION_READ',
        payload: { id }
      }));
    } else {
      console.error('WebSocket is not connected');
    }

    // Update local state
    setNotifications(prev => prev.filter(n => n.id !== id));
    setHasUnread(notifications.length > 1);
  };

  // Helper to get the WebSocket instance
  const getWebSocket = (): WebSocket | null => {
    // Since we can't easily access the WebSocket from the TaskProvider,
    // we can check if any WebSocket instances exist and use the first one
    for (const key in window) {
      const value = (window as any)[key];
      if (value instanceof WebSocket) {
        return value;
      }
    }
    return null;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        hasUnread,
        markAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
