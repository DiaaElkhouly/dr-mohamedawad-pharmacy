"use client";

import Image from "next/image";
import { useCart } from "@/lib/cartContext";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex justify-center">
      <div className="flex flex-col sm:flex-row gap-4  bg-white rounded-lg border border-gray-200 w-[85%]">
        {/* Product Image */}
        <div className="relative w-full sm:w-24 h-30 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
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
                className="w-8 h-8"
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

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col p-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 truncate">
              {item.name}
            </h3>
            <button
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-emerald-600 font-bold">{item.price} ج.م</p>
            {item.oldPrice && (
              <p className="text-gray-400 line-through text-sm">
                {item.oldPrice} ج.م
              </p>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between sm:justify-start gap-3 mt-2 sm:mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
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
                    d="M20 12H4"
                  />
                </svg>
              </button>

              <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {/* Total Price */}
            <div className="text-right sm:text-left">
              <p className="text-sm text-gray-500">المجموع</p>
              {item.originalPrice && item.originalPrice !== item.price && (
                <p className="text-gray-400 line-through text-sm">
                  {((item.originalPrice || item.price) * item.quantity).toFixed(
                    2,
                  )}{" "}
                  ج.م
                </p>
              )}
              <p className="font-bold text-gray-900">
                {(item.price * item.quantity).toFixed(2)} ج.م
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
