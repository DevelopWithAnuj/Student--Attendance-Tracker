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
        },
      ];
    });
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
