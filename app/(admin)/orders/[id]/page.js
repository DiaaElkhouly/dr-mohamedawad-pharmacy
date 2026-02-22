"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import OrderDetails from "@/components/admin/OrderDetails";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        // Order not found, redirect to orders list
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        alert("حدث خطأ أثناء تأكيد الطلب");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("حدث خطأ أثناء تأكيد الطلب");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) {
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        alert("حدث خطأ أثناء إلغاء الطلب");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("حدث خطأ أثناء إلغاء الطلب");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-500 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>العودة للطلبات</span>
        </Link>
      </div>

      {/* Order Details */}
      <OrderDetails
        order={order}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isUpdating={isUpdating}
      />
    </div>
  );
}
