"use client";

import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import CartItem from "@/components/customer/CartItem";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  if (cart.length === 0) {
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
            <Button variant="primary" size="lg">
              تسوق الآن
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">سلة المشتريات</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">ملخص الطلب</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>عدد المنتجات</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>إجمالي المنتجات</span>
                <span>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between text-sm font-bold">
                <span>السعر قبل التخفيض </span>
                <span className="text-red-400">
                  {cart
                    .reduce(
                      (sum, item) =>
                        sum + (item.oldPrice || item.price) * item.quantity,
                      0,
                    )
                    .toFixed(2)}{" "}
                  ج.م
                </span>
              </div>
              {cart.reduce(
                (sum, item) =>
                  sum +
                  (item.oldPrice
                    ? (item.oldPrice - item.price) * item.quantity
                    : 0),
                0,
              ) > 0 && (
                <div className="flex justify-between text-sm font-bold">
                  <span>التوفير:</span>
                  <span className="text-green-600">
                    {cart
                      .reduce(
                        (sum, item) =>
                          sum +
                          (item.oldPrice
                            ? (item.oldPrice - item.price) * item.quantity
                            : 0),
                        0,
                      )
                      .toFixed(2)}{" "}
                    ج.م
                  </span>
                </div>
              )}
              <div className=" pt-3 flex justify-between text-lg font-bold">
                <span>المبلغ الاجمالي : </span>
                <span className="text-emerald-600">{total.toFixed(2)} ج.م</span>
              </div>
            </div>

            <Link href="/checkout" className="block mb-3">
              <Button variant="primary" size="lg" className="w-full">
                إتمام الشراء
              </Button>
            </Link>

            <button
              onClick={clearCart}
              className="w-full text-gray-500 hover:text-red-500 text-sm transition-colors"
            >
              إفراغ السلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
