"use client";

import Link from "next/link";

const OrderCard = ({ order }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "قيد الانتظار", className: "badge-pending" },
      confirmed: { label: "تم التأكيد", className: "badge-confirmed" },
      cancelled: { label: "ملغي", className: "badge-cancelled" },
      shipped: { label: "تم الشحن", className: "bg-blue-100 text-blue-800" },
      delivered: {
        label: "تم التوصيل",
        className: "bg-green-100 text-green-800",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };

    return <span className={`badge ${config.className}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total old price
  const calculateTotalOldPrice = () => {
    let totalOldPrice = 0;
    let hasOldPrice = false;

    order.items?.forEach((item) => {
      if (item.oldPrice && item.oldPrice > 0) {
        totalOldPrice += item.oldPrice * item.quantity;
        hasOldPrice = true;
      } else {
        totalOldPrice += item.price * item.quantity;
      }
    });

    return { totalOldPrice, hasOldPrice };
  };

  const { totalOldPrice, hasOldPrice } = calculateTotalOldPrice();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow w-[90%]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            طلب #{order.id.slice(-8)}
          </h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div
          className={`text-sm rounded-2xl p-2 ${order.status === "confirmed" ? "bg-green-500" : order.status === "pending" ? "bg-blue-500" : "bg-red-500"} text-white`}
        >
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-gray-600">{order.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="text-gray-600">{order.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-gray-600 truncate max-w-50">
            {order.address}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-500">عدد المنتجات</span>
          <p className="font-medium">{order.items?.length || 0}</p>
        </div>
        <div className="text-left">
          <span className="text-xs text-gray-500">المبلغ الإجمالي</span>
          {hasOldPrice && totalOldPrice > order.totalAmount ? (
            <>
              <p className="text-xs text-red-400 line-through">
                {totalOldPrice.toFixed(2)} ج.م
              </p>
              <p className="font-bold text-emerald-600">
                {order.totalAmount} ج.م
              </p>
            </>
          ) : (
            <p className="font-bold text-emerald-600">
              {order.totalAmount} ج.م
            </p>
          )}
        </div>

        <Link
          href={`/orders/${order.id}`}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
