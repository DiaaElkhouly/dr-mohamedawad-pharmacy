"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ArchivesPage() {
  const [monthlyArchives, setMonthlyArchives] = useState([]);
  const [dailyArchives, setDailyArchives] = useState([]);
  const [currentStats, setCurrentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch("/api/admin/monthly-archive");
        if (response.ok) {
          const data = await response.json();
          setMonthlyArchives(data.monthlyArchives || []);
          setDailyArchives(data.dailyArchives || []);
          setCurrentStats(data.currentStats);
        }
      } catch (error) {
        console.error("Error fetching archives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, []);

  // Function to get month name in Arabic
  const getMonthName = (month) => {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    return months[month - 1] || month;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format simple date
  const formatSimpleDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 md:gap-4 mb-2">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              الأرشيفات
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              سجل المبيعات والأطلبات اليومية والشهرية
            </p>
          </div>
        </div>
      </div>

      {/* Current Stats */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-4 md:p-6 mb-6 md:mb-8 text-white">
        <h2 className="text-base md:text-lg font-semibold mb-4">
          الإحصائيات الحالية
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm opacity-80">المبيعات اليومية</p>
            <p className="text-xl md:text-2xl font-bold">
              {formatCurrency(currentStats?.dailySales || 0)}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm opacity-80">المبيعات الشهرية</p>
            <p className="text-xl md:text-2xl font-bold">
              {formatCurrency(currentStats?.monthlySales || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("daily")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "daily"
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          الأرشيف اليومي
        </button>
        <button
          onClick={() => setActiveTab("monthly")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "monthly"
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          الأرشيف الشهري
        </button>
      </div>

      {/* Daily Archives */}
      {activeTab === "daily" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              الأرشيف اليومي (آخر 30 يوم)
            </h2>
          </div>

          {dailyArchives.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500">لا توجد أرشيفات يومية سابقة</p>
              <p className="text-sm text-gray-400 mt-1">
                الأرشيف اليومي سيتم إنشاؤه عند منتصف الليل
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {dailyArchives
                .slice()
                .reverse()
                .map((archive, index) => (
                  <div
                    key={archive.id || index}
                    className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900">
                            {formatSimpleDate(archive.date)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {archive.dailyOrders} طلب
                            {archive.manualTrigger && (
                              <span className="mr-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                اختبار يدوي
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
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
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-semibold">
                            {formatCurrency(archive.dailySales)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          تاريخ الأرشفة: {formatDate(archive.archivedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Monthly Archives */}
      {activeTab === "monthly" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              الأرشيف الشهري
            </h2>
          </div>

          {monthlyArchives.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-4"
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
              <p className="text-gray-500">لا توجد أرشيفات شهرية سابقة</p>
              <p className="text-sm text-gray-400 mt-1">
                الأرشيف الشهري سيتم إنشاؤه في أول يوم من كل شهر
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {monthlyArchives.map((archive, index) => (
                <div
                  key={archive.id || index}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {getMonthName(archive.month)} {archive.year}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {archive.ordersCount} طلب
                          {archive.manualTrigger && (
                            <span className="mr-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              اختبار يدوي
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-semibold">
                          {formatCurrency(archive.monthlySales)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        تاريخ الأرشفة: {formatDate(archive.archivedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
