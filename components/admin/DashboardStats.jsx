"use client";

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: "مبيعات اليوم",
      value: stats?.dailySales || 0,
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "مبيعات الشهر",
      value: stats?.monthlySales || 0,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "طلبات اليوم",
      value: stats?.dailyOrders || 0,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      color: "bg-amber-500",
      textColor: "text-amber-600",
    },
    {
      title: "طلبات الشهر",
      value: stats?.monthlyOrders || 0,
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{stat.title}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString("ar-EG")
                  : stat.value}
                <span className="text-xs sm:text-sm font-normal mr-1">
                  {stat.title == "مبيعات الشهر" || stat.title == "مبيعات اليوم"
                    ? "ج.م"
                    : ""}
                </span>
              </p>
            </div>
            <div className={`${stat.color} p-2 sm:p-3 rounded-full text-white ml-3`}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {stat.icon.props.children}
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
