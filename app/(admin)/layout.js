"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { initializePushNotifications } from "@/lib/pushNotifications";
import {
  NotificationProvider,
  useNotification,
} from "@/components/admin/NotificationProvider";
import NotificationBadge from "@/components/admin/NotificationBadge";
import Link from "next/link";
import { verifyAdminToken } from "@/lib/adminAuth";

function NotificationBanner() {
  const { hasNewOrders, newOrdersCount, pendingCount } = useNotification();

  return (
    <>
      {/* New Orders Alert Banner */}
      {hasNewOrders && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg animate-pulse flex items-center gap-2 shadow-lg">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span className="font-bold">{newOrdersCount} طلب جديد!</span>
          <Link
            href="/orders"
            className="mr-2 text-sm underline hover:text-red-900"
          >
            عرض الطلبات
          </Link>
        </div>
      )}

      {/* Pending Orders Badge in Top Right */}
      <div className="fixed top-4 left-20 z-40">
        <NotificationBadge count={pendingCount} />
      </div>
    </>
  );
}

function AdminLayoutContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Skip auth check for login page - redirect to dashboard
    if (pathname === "/login") {
      const token = localStorage.getItem("adminToken");
      if (token && verifyAdminToken(token)) {
        router.push("/dashboard");
      }
      setIsReady(true);
      return;
    }

    // Check authentication on mount
    const token = localStorage.getItem("adminToken");
    if (!token || !verifyAdminToken(token)) {
      // Not authenticated, redirect to login
      router.push("/login");
    } else {
      setIsReady(true);
    }
  }, [pathname, router]);

  useEffect(() => {
    if (isReady && "serviceWorker" in navigator) {
      initializePushNotifications().catch((error) => {
        console.log("Push notification initialization failed:", error);
      });
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 mx-4">
        <NotificationBanner />
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <NotificationProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </NotificationProvider>
  );
}
