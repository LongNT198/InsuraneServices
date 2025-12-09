import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success',
      title: 'Premium Payment Successful',
      message: 'Your premium payment of ₹25,000 has been processed successfully.',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Policy Renewal Reminder',
      message: 'Your Life Insurance policy is due for renewal in 15 days.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Document Required',
      message: 'Additional documents needed for claim CLM-2024-156.',
      time: '1 day ago',
      read: false,
    },
    {
      id: '4',
      type: 'success',
      title: 'Claim Approved',
      message: 'Your claim CLM-2024-142 has been approved. Amount: ₹50,000',
      time: '2 days ago',
      read: true,
    },
    {
      id: '5',
      type: 'info',
      title: 'New Scheme Available',
      message: 'Check out our new Family Health Shield plan with exclusive benefits.',
      time: '3 days ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="size-4 text-orange-500" />;
      default:
        return <Clock className="size-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <p className="font-semibold">Notifications</p>
            <p className="text-xs text-gray-500">{unreadCount} unread messages</p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="size-12 mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => removeNotification(notification.id, e)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" className="w-full text-sm" size="sm">
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


