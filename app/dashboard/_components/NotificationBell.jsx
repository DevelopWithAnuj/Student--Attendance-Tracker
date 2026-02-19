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
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const onOpenChange = (open) => {
    if (!open) {
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
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="p-4">
          <h4 className="font-medium text-lg mb-2">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new notifications.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 rounded-lg mb-2 ${
                    notification.read ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900"
                  }`}
                >
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
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
