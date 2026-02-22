// Form validation functions

export const validatePhone = (phone) => {
  // Egyptian phone number validation
  const egyptianPhoneRegex = /^(\+20|0)?1[0-2,5,9]\d{8}$/;
  return egyptianPhoneRegex.test(phone.replace(/\s/g, ""));
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.trim().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.trim().length <= maxLength;
};

export const validateOrderForm = (data) => {
  const errors = {};

  // Customer name validation
  if (!validateRequired(data.customerName)) {
    errors.customerName = "يرجى إدخال الاسم";
  } else if (!validateMinLength(data.customerName, 2)) {
    errors.customerName = "الاسم يجب أن يكون حرفين على الأقل";
  }

  // Phone validation
  if (!validateRequired(data.phone)) {
    errors.phone = "يرجى إدخال رقم الهاتف";
  } else if (!validatePhone(data.phone)) {
    errors.phone = "يرجى إدخال رقم هاتف صحيح";
  }

  // Address validation
  if (!validateRequired(data.address)) {
    errors.address = "يرجى إدخال العنوان";
  } else if (!validateMinLength(data.address, 10)) {
    errors.address = "العنوان يجب أن يكون 10 أحرف على الأقل";
  }

  // Details (optional)
  if (data.details && !validateMaxLength(data.details, 500)) {
    errors.details = "التفاصيل يجب أن تكون أقل من 500 حرف";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProductForm = (data) => {
  const errors = {};

  // Product name validation
  if (!validateRequired(data.name)) {
    errors.name = "يرجى إدخال اسم المنتج";
  }

  // Price validation
  if (!data.price) {
    errors.price = "يرجى إدخال السعر";
  } else if (isNaN(data.price) || parseFloat(data.price) <= 0) {
    errors.price = "السعر يجب أن يكون رقماً موجباً";
  }

  // Category validation
  if (!validateRequired(data.category)) {
    errors.category = "يرجى اختيار التصنيف";
  }

  // Stock validation
  if (
    data.stock !== undefined &&
    (isNaN(data.stock) || parseInt(data.stock) < 0)
  ) {
    errors.stock = "الكمية يجب أن تكون رقماً صحيحاً";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
