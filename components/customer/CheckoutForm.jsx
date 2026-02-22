"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { validateOrderForm } from "@/lib/validations";

const CheckoutForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    details: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateOrderForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit form
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Name */}
      <Input
        label="الاسم الكامل"
        name="customerName"
        value={formData.customerName}
        onChange={handleChange}
        error={errors.customerName}
        placeholder="أدخل اسمك الكامل"
        required
      />

      {/* Phone Number */}
      <Input
        label="رقم الهاتف"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="01xxxxxxxxx"
        required
      />

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          العنوان <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="أدخل العنوان بالتفصيل (الحي، الشارع، رقم المنزل)"
          rows={3}
          className={`w-full px-4 py-2.5 border rounded-lg resize-none
            ${
              errors.address
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            transition-colors duration-200
          `}
        />
        {errors.address && (
          <p className="mt-1.5 text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Additional Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          ملاحظات إضافية (اختياري)
        </label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="أي ملاحظات خاصة بالطلب"
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-colors duration-200
          "
        />
        {errors.details && (
          <p className="mt-1.5 text-sm text-red-500">{errors.details}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={isLoading}
      >
        {isLoading ? "جاري إرسال الطلب..." : "إرسال الطلب"}
      </Button>

      {/* Privacy Note */}
      <p className="text-xs text-gray-500 text-center">
        سيتم التواصل معك لتأكيد الطلب خلال 24 ساعة
      </p>
    </form>
  );
};

export default CheckoutForm;
