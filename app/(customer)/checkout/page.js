"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import CheckoutForm from "@/components/customer/CheckoutForm";
import CartItem from "@/components/customer/CartItem";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const total = getCartTotal();

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            سلة المشتريات فارغة
          </h2>
          <p className="text-gray-500 mb-8">لم تقم بإضافة أي منتجات بعد</p>
          <Link href="/">
            <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              تسوق الآن
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container-custom py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم إرسال طلبك بنجاح!
          </h2>
          <p className="text-gray-600 mb-2">
            رقم الطلب: <span className="font-bold">#{orderId}</span>
          </p>
          <p className="text-gray-500 mb-8">
            شكراً لطلبك! سنتواصل معك قريباً لتأكيد الطلب.
          </p>
          <Link href="/">
            <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              العودة للرئيسية
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const orderData = {
        ...formData,
        items: cart,
        totalAmount: total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();

      setOrderId(result.order.id);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">إتمام الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              معلومات التوصيل
            </h2>
            <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">ملخص الطلب</h2>

            {/* Products */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <span className="text-gray-500">×{item.quantity}</span>
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toFixed(2)} ج.م
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>المجموع</span>
                <span className="text-emerald-600">{total.toFixed(2)} ج.م</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
