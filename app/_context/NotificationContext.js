"use client";
import React, { createContext, useContext, useState, useRef } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const notificationIdCounter = useRef(0);

  const addNotification = (notification) => {
    setNotifications((prev) => {
      const isDuplicate = prev.some(
        (n) =>
          n.title === notification.title && n.message === notification.message,
      );
      if (isDuplicate) {
        return prev;
      }
      const newId = notificationIdCounter.current++;
      return [
        ...prev,
        {
          ...notification,
          id: newId,
          read: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ];
    });
  };

  const setBulkNotifications = (newNotifications) => {
    // This replaces current notifications with a new set, 
    // ensuring we don't just keep appending to the old list.
    const notificationsWithMetadata = newNotifications.map((n, index) => ({
      ...n,
      id: notificationIdCounter.current++,
      read: false,
      timestamp: new Date().toLocaleTimeString(),
    }));
    setNotifications(notificationsWithMetadata);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, setBulkNotifications, markAsRead, clearNotifications, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
