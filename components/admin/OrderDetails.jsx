"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

const OrderDetails = ({ order, onConfirm, onCancel, isUpdating }) => {
  if (!order) return null;

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total old price and savings
  const calculateTotals = () => {
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

    const savings = totalOldPrice - order.totalAmount;
    return { totalOldPrice, savings, hasOldPrice };
  };

  const { totalOldPrice, savings, hasOldPrice } = calculateTotals();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              تفاصيل الطلب #{order.id.slice(-8)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          {/* status */}
          <div className="flex flex-col items-center gap-2">
            {/* check the status */}
            {order.status == "pending" ? (
              <div className=" bg-amber-600 p-2 rounded-2xl">
                {getStatusBadge(order.status)}
              </div>
            ) : order.status == "confirmed" ? (
              <div className=" bg-green-600 p-2 rounded-2xl">
                {getStatusBadge(order.status)}
              </div>
            ) : order.status == "cancelled" ? (
              <div className=" bg-red-600 p-2 rounded-2xl">
                {getStatusBadge(order.status)}
              </div>
            ) : null}
            {/* === check the status === */}
            {/* updated time */}
            <p className="text-sm text-gray-500 mt-1">
              {order.updatedAt
                ? `تم التحديث في ${formatDate(order.updatedAt)}`
                : null}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">معلومات العميل</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
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
            </div>
            <div>
              <p className="text-xs text-gray-500">الاسم</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
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
            </div>
            <div>
              <p className="text-xs text-gray-500">رقم الهاتف</p>
              <p className="font-medium">{order.phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">العنوان</p>
          <p className="font-medium">{order.address}</p>
        </div>

        {order.details && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-1">ملاحظات</p>
            <p className="font-medium text-gray-700">{order.details}</p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">
          المنتجات ({order.items?.length || 0})
        </h3>
        <div className="space-y-4">
          {order.items?.map((item, index) => (
            <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  {item.price} ج.م × {item.quantity}
                </p>
                {/* {item.oldPrice && item.oldPrice > 0 && (
                  <span className="mr-2 text-red-400 line-through text-xs">
                    {item.oldPrice} ج.م
                  </span>
                )} */}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {(item.price * item.quantity).toFixed(2)} ج.م
                </p>
                {item.oldPrice && item.oldPrice > 0 && (
                  <p className="text-xs text-red-400 line-through">
                    {((item.oldPrice || item.price) * item.quantity).toFixed(2)}{" "}
                    ج.م
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="p-6 bg-gray-50">
        {hasOldPrice && savings > 0 && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">السعر قبل التخفيض</span>
            <span className="text-sm text-red-400 line-through">
              {totalOldPrice.toFixed(2)} ج.م
            </span>
          </div>
        )}
        {hasOldPrice && savings > 0 && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-600">التوفير</span>
            <span className="text-sm text-green-600">
              {savings.toFixed(2)} ج.م
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">المبلغ الإجمالي</span>
          <span className="text-2xl font-bold text-emerald-600">
            {order.totalAmount} ج.م
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {order.status === "pending" && (
        <div className="p-6 border-t border-gray-200 flex gap-4">
          <Button
            variant="primary"
            onClick={() => onConfirm(order.id)}
            loading={isUpdating}
            className="flex-1"
          >
            تأكيد الطلب
          </Button>
          <Button
            variant="danger"
            onClick={() => onCancel(order.id)}
            loading={isUpdating}
            className="flex-1"
          >
            إلغاء الطلب
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
