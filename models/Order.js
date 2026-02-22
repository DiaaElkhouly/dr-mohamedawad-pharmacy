// Order Model - Data structure for orders

export const OrderStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
};

export const Order = {
  // Order fields
  id: null,
  customerName: "",
  phone: "",
  address: "",
  details: "",
  items: [],
  totalAmount: 0,
  status: OrderStatus.PENDING,
  createdAt: null,
  updatedAt: null,

  // Create a new order
  create: (data) => {
    const totalAmount = data.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return {
      ...Order,
      ...data,
      id: data.id || Date.now().toString(),
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
  },

  // Validate order data
  validate: (order) => {
    const errors = [];

    if (!order.customerName || order.customerName.trim() === "") {
      errors.push("Customer name is required");
    }

    if (!order.phone || order.phone.trim() === "") {
      errors.push("Phone number is required");
    }

    if (!order.address || order.address.trim() === "") {
      errors.push("Address is required");
    }

    if (!order.items || order.items.length === 0) {
      errors.push("Order must have at least one item");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get status label in Arabic
  getStatusLabel: (status) => {
    const labels = {
      [OrderStatus.PENDING]: "قيد الانتظار",
      [OrderStatus.CONFIRMED]: "تم التأكيد",
      [OrderStatus.CANCELLED]: "ملغي",
      [OrderStatus.SHIPPED]: "تم الشحن",
      [OrderStatus.DELIVERED]: "تم التوصيل",
    };
    return labels[status] || status;
  },

  // Get status badge class
  getStatusBadgeClass: (status) => {
    const classes = {
      [OrderStatus.PENDING]: "badge-pending",
      [OrderStatus.CONFIRMED]: "badge-confirmed",
      [OrderStatus.CANCELLED]: "badge-cancelled",
      [OrderStatus.SHIPPED]: "badge-info",
      [OrderStatus.DELIVERED]: "badge-success",
    };
    return classes[status] || "";
  },

  // Calculate order total
  calculateTotal: (items) => {
    return items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  },

  // Format order for display
  formatForDisplay: (order) => {
    return {
      ...order,
      totalAmount: parseFloat(order.totalAmount).toFixed(2),
      statusLabel: Order.getStatusLabel(order.status),
      statusClass: Order.getStatusBadgeClass(order.status),
      createdAtFormatted: new Date(order.createdAt).toLocaleDateString(
        "ar-EG",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
    };
  },
};

export default Order;
