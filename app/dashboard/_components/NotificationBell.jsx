"use client";
import React from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/app/_context/NotificationContext";
import { Button } from "@/components/ui/button";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, clearNotifications } = useNotifications();

  const onOpenChange = (open) => {
    // Mark as read when opening to immediately clear the badge
    if (open) {
      notifications.forEach((n) => {
        if (!n.read) {
          markAsRead(n.id);
        }
      });
    }
  };

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-lg">Notifications</h4>
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-red-500"
                onClick={clearNotifications}
              >
                Clear All
              </Button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new notifications.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all ${
                    notification.read 
                      ? "bg-background border-border/50 opacity-80" 
                      : "bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold text-sm leading-tight">{notification.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notification.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
