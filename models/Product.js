// Product Model - Data structure for products

export const Product = {
  // Product fields
  id: null,
  name: "",
  nameEn: "",
  price: 0,
  oldPrice: null,
  category: "",
  image: "",
  description: "",
  inStock: true,
  stock: 0,
  rating: 0,
  reviews: 0,
  createdAt: null,

  // Create a new product
  create: (data) => {
    return {
      ...Product,
      ...data,
      id: data.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
  },

  // Validate product data
  validate: (product) => {
    const errors = [];

    if (!product.name || product.name.trim() === "") {
      errors.push("Product name is required");
    }

    if (!product.price || product.price <= 0) {
      errors.push("Product price must be greater than 0");
    }

    if (!product.category || product.category.trim() === "") {
      errors.push("Product category is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Format product for display
  formatForDisplay: (product) => {
    return {
      ...product,
      price: parseFloat(product.price).toFixed(2),
      oldPrice: product.oldPrice
        ? parseFloat(product.oldPrice).toFixed(2)
        : null,
      discount: product.oldPrice
        ? Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100,
          )
        : 0,
    };
  },
};

export default Product;
