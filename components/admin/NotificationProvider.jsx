"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import notificationSound, {
  initializeNotificationSound,
} from "@/lib/notificationSound";
import {
  getNotificationStatus,
  showNotification,
} from "@/lib/pushNotifications";

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationState, setNotificationState] = useState({
    hasNewOrders: false,
    newOrdersCount: 0,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const previousOrderIdsRef = useRef(new Set());
  const isFirstLoadRef = useRef(true);
  const audioInitializedRef = useRef(false);
  const timeoutRef = useRef(null);

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(() => {
    if (!audioInitializedRef.current) {
      initializeNotificationSound();
      audioInitializedRef.current = true;
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        return data.orders;
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    return [];
  }, []);

  // Check notification status
  useEffect(() => {
    const checkStatus = async () => {
      const status = await getNotificationStatus();
      setNotificationsEnabled(status.granted);
    };
    checkStatus();
  }, []);

  // Handle new orders detection
  useEffect(() => {
    if (orders.length === 0) {
      isFirstLoadRef.current = false;
      return;
    }

    const currentOrderIds = new Set(orders.map((order) => order.id));

    // On first load, just store the IDs without triggering notification
    if (isFirstLoadRef.current) {
      previousOrderIdsRef.current = currentOrderIds;
      isFirstLoadRef.current = false;
      return;
    }

    // Find new orders by comparing with previous IDs
    const newOrderIds = [];
    currentOrderIds.forEach((id) => {
      if (!previousOrderIdsRef.current.has(id)) {
        newOrderIds.push(id);
      }
    });

    // If there are new orders, trigger notification
    if (newOrderIds.length > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      notificationSound.playNotificationSound();

      showNotification("طلب جديد!", {
        body: `تم استلام ${newOrderIds.length} طلب جديد`,
        tag: "new-order",
        requireInteraction: true,
        data: {
          url: "/orders",
        },
      });

      timeoutRef.current = setTimeout(() => {
        setNotificationState({
          hasNewOrders: true,
          newOrdersCount: newOrderIds.length,
        });

        timeoutRef.current = setTimeout(() => {
          setNotificationState((prev) => ({
            ...prev,
            hasNewOrders: false,
          }));
        }, 5000);
      }, 0);
    }

    previousOrderIdsRef.current = currentOrderIds;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [orders]);

  // Initial fetch and polling
  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
      setLoading(false);
    };
    loadOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("Notifications not supported in this browser");
      return false;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return Notification.permission === "granted";
  }, []);

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    initializeAudio();
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    return granted;
  }, [initializeAudio, requestNotificationPermission]);

  // Get pending orders count
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const value = {
    orders,
    loading,
    hasNewOrders: notificationState.hasNewOrders,
    newOrdersCount: notificationState.newOrdersCount,
    pendingCount,
    notificationsEnabled,
    initializeAudio,
    enableNotifications,
    fetchOrders,
    requestNotificationPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
