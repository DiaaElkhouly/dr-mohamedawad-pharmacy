"use client";

import { useState, useEffect } from "react";
import DashboardStats from "@/components/admin/DashboardStats";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          لوحة المعلومات
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          إحصائيات المبيعات والطلبات
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 md:mb-8">
        <DashboardStats stats={stats} />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            إجراءات سريعة
          </h2>
          <div className="space-y-2 md:space-y-3">
            <Link
              href="/dashboard/archives"
              className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                  الأرشيف
                </p>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  استعرض أرشيفات الأيام و الشهور السابقة
                </p>
              </div>
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base font-medium text-gray-900 truncate">
                  عرض الطلبات
                </p>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  استعرض جميع الطلبات الواردة
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            نظرة عامة
          </h2>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-gray-600">
                حالة المتجر
              </span>
              <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs md:text-sm font-medium">
                نشط
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-gray-600">
                آخر تحديث
              </span>
              <span className="text-xs md:text-sm text-gray-900 font-medium">
                {new Date().toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
