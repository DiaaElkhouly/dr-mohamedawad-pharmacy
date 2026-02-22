"use client";

import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { useState } from "react";
import Image from "next/image";

const Header = () => {
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = getCartCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 mb-4">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className=" rounded-full flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={50}
                height={50}
                className="rounded-2xl"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                صيدلية د/ محمد عواد
              </h1>
              <p className="text-xs text-gray-500">
                للمستحضرات الطبية والتجميلية
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-emerald-500 transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              href="/?category=hair"
              className="text-gray-600 hover:text-emerald-500 transition-colors"
            >
              العناية بالشعر
            </Link>
            <Link
              href="/?category=skin"
              className="text-gray-600 hover:text-emerald-500 transition-colors"
            >
              العناية بالبشرة
            </Link>
            <Link
              href="/?category=body"
              className="text-gray-600 hover:text-emerald-500 transition-colors"
            >
              العناية بالجسم
            </Link>
          </nav>

          {/* Cart & Admin Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:block text-gray-500 hover:text-emerald-500 transition-colors"
            >
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-emerald-500 transition-colors"
            >
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                الرئيسية
              </Link>
              <Link
                href="/?category=hair"
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                العناية بالشعر
              </Link>
              <Link
                href="/?category=skin"
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                العناية بالبشرة
              </Link>
              <Link
                href="/?category=body"
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                العناية بالجسم
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                لوحة الأدمن
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
