"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/customer/ProductCard";
import CategoryFilter from "@/components/customer/CategoryFilter";
import PWAInstallPrompt from "@/components/customer/PWAInstallPrompt";
import Image from "next/image";

function HomeContent({ initialProducts = [] }) {
  const searchParams = useSearchParams();

  // Initialize with default category to ensure consistent SSR/client rendering
  const [activeCategory, setActiveCategory] = useState("all");
  const [isHydrated, setIsHydrated] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  // Fetch products from API (reads from database where admin adds products)
  // Only fetch if no initial products (for dynamic content)
  useEffect(() => {
    if (initialProducts.length > 0) {
      setIsHydrated(true);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setIsHydrated(true);
      }
    };
    fetchProducts();
  }, [initialProducts.length]);

  // After hydration, read URL params and update category
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    setIsHydrated(true);
  }, [searchParams]);

  // Use useMemo to filter products based on category
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (activeCategory === "all") {
      return products;
    }
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="container-custom ">
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl py-4 text-[#cc842a] text-center">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent animate-fade-in -mt-4">
            أهلا بك في صيديلة د/ محمد عواد
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium">
            رعايتك الصحية أولويتنا
          </p>
        </div>
        <Image
          src="/bg-hero.jpg"
          alt="صيدلية د / محمد عواد"
          width={1500}
          height={500}
          className="rounded-2xl h-35 sm:h-60 md:h-90 w-full "
        />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid-products">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-500 text-lg">لا توجد منتجات في هذا التصنيف</p>
        </div>
      )}

      {/* Products Count */}
      {filteredProducts.length > 0 && (
        <p className="text-center text-gray-500 mt-8">
          عرض {filteredProducts.length} منتج
        </p>
      )}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default function HomePageContent({ initialProducts = [] }) {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      }
    >
      <HomeContent initialProducts={initialProducts} />
    </Suspense>
  );
}
