import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "Sunday Morning Special",
      message: "Pre-book fresh Country Chicken before 9 PM for 7 AM door delivery.",
      time: "1 hour ago",
      read: false
    },
    {
      id: "n-2",
      title: "Fresh Vanjaram Fish In Stock",
      message: "Today's fresh coast catch arrived. Available in neat round steaks.",
      time: "3 hours ago",
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (item) => {
    setNotifications((prev) => [
      { id: `n-${Date.now()}`, read: false, time: "Just now", ...item },
      ...prev
    ]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
