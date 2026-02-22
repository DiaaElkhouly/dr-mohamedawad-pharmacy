"use client";

import { useState, useEffect } from "react";
import OrderCard from "@/components/admin/OrderCard";
import { useNotification } from "@/components/admin/NotificationProvider";
import {
  getNotificationStatus,
  isNotificationSupported,
} from "@/lib/pushNotifications";

export default function OrdersPage() {
  const { orders, loading, enableNotifications } = useNotification();
  const [filter, setFilter] = useState("all");
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Check existing subscription status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const status = await getNotificationStatus();
      setNotificationsEnabled(status.granted);
    };
    checkStatus();
  }, []);

  // Enable notifications on user interaction
  const handleEnableNotifications = async () => {
    setNotificationsLoading(true);
    setNotificationError(null);

    try {
      if (!isNotificationSupported()) {
        setNotificationError("الإشعارات غير مدعومة في هذا المتصفح");
        setNotificationsLoading(false);
        return;
      }

      const success = await enableNotifications();

      if (success) {
        setNotificationsEnabled(true);
        setNotificationError(null);
      } else {
        const status = getNotificationStatus();
        if (status.permission === "denied") {
          setNotificationError(
            "تم رفض الإذن. يرجى تمكين الإشعارات من إعدادات المتصفح",
          );
        } else {
          setNotificationError("فشل تفعيل الإشعارات. يرجى المحاولة مرة أخرى");
        }
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      setNotificationError("حدث خطأ أثناء تفعيل الإشعارات");
    } finally {
      setNotificationsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الطلبات</h1>
          <p className="text-gray-500 mt-1">استعرض وإدارة الطلبات الواردة</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Enable Notifications Button */}
          {!notificationsEnabled && (
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleEnableNotifications}
                disabled={notificationsLoading}
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  notificationsLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {notificationsLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري التفعيل...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    تفعيل الإشعارات
                  </>
                )}
              </button>
              {notificationError && (
                <span className="text-red-500 text-xs max-w-xs text-right">
                  {notificationError}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
            ${
              filter === "all"
                ? "bg-emerald-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
        >
          جميع الطلبات ({orders.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
            ${
              filter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
        >
          قيد الانتظار ({orders.filter((o) => o.status === "pending").length})
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
            ${
              filter === "confirmed"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
        >
          مؤكدة ({orders.filter((o) => o.status === "confirmed").length})
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
            ${
              filter === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
        >
          ملغاة ({orders.filter((o) => o.status === "cancelled").length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500">لا توجد طلبات</p>
        </div>
      )}
    </div>
  );
}
