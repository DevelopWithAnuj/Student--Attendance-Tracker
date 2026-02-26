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
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 group transition-all">
          <Bell className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-[9px] text-white flex items-center justify-center font-black border-2 border-white dark:border-slate-950 shadow-sm animate-bounce">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-3xl border-none shadow-2xl overflow-hidden mt-2 bg-white dark:bg-slate-950" align="end">
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Notifications</h4>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-3 text-[10px] font-black uppercase tracking-tighter text-rose-500 hover:bg-rose-50 rounded-lg"
              onClick={clearNotifications}
            >
              Clear All
            </Button>
          )}
        </div>
        
        <div className="p-4 pt-2">
          {notifications.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-3 opacity-40">
               <Bell className="h-8 w-8 text-slate-300" />
               <p className="text-[10px] font-black uppercase tracking-widest">Inbox is empty</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-2xl border transition-all group hover:scale-[1.02] duration-200 ${
                    notification.read 
                      ? "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800" 
                      : "bg-primary/5 border-primary/10 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <p className={`text-xs font-black leading-tight tracking-tight ${notification.read ? "text-slate-600 dark:text-slate-300" : "text-primary"}`}>
                      {notification.title}
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-full">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-center">
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">End of notifications</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
