"use client";

import { categories } from "@/models/mockData";

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">التصنيفات</h2>
      <div className="flex overflow-x-auto gap-3">
        {/* All Products Button */}
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap
            ${
              activeCategory === "all"
                ? "bg-[#f4af35] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-[#f4af35]/10 border border-gray-200"
            }`}
        >
          <span className="ml-1">🛍️</span>
          جميع المنتجات
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap
              ${
                activeCategory === category.id
                  ? "bg-[#f4af35] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-[#f4af35]/10 border border-gray-200"
              }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="ml-1">{category.icon}</span>
              <span className="text-xs sm:text-sm">{category.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
