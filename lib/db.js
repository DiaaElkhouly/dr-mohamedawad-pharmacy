// Database utilities for file-based storage
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data");

// Ensure data directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Products data file
const productsFile = path.join(dbPath, "products.json");
// Orders data file
const ordersFile = path.join(dbPath, "orders.json");
// Stats data file
const statsFile = path.join(dbPath, "stats.json");

// Initialize files if they don't exist
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(statsFile)) {
  const initialStats = {
    dailySales: 0,
    monthlySales: 0,
    dailyOrders: 0,
    monthlyOrders: 0,
    lastUpdated: new Date().toISOString().split("T")[0],
  };
  fs.writeFileSync(statsFile, JSON.stringify(initialStats, null, 2));
}

// Products CRUD operations
export const getProducts = () => {
  try {
    const data = fs.readFileSync(productsFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const getProductById = (id) => {
  const products = getProducts();
  return products.find((p) => p.id === id);
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  return newProduct;
};

export const updateProduct = (id, updates) => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    return products[index];
  }
  return null;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  fs.writeFileSync(productsFile, JSON.stringify(filtered, null, 2));
  return true;
};

// Orders CRUD operations
export const getOrders = () => {
  try {
    const data = fs.readFileSync(ordersFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const getOrderById = (id) => {
  const orders = getOrders();
  return orders.find((o) => o.id === id);
};

export const createOrder = (orderData) => {
  const orders = getOrders();
  const newOrder = {
    ...orderData,
    id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

  // Update stats
  updateStatsOnNewOrder(newOrder);

  return newOrder;
};

// Stats operations for order cancellation
const updateStatsOnOrderCancel = (order) => {
  try {
    const statsData = fs.readFileSync(statsFile, "utf-8");
    let stats = JSON.parse(statsData);

    const orderAmount = order.totalAmount || 0;
    const today = new Date().toISOString().split("T")[0];

    // Check if the order was created today to update daily stats
    const orderDate = order.createdAt ? order.createdAt.split("T")[0] : null;

    if (orderDate === today) {
      stats.dailySales = Math.max(0, stats.dailySales - orderAmount);
      stats.dailyOrders = Math.max(0, stats.dailyOrders - 1);
    }

    // Always update monthly stats when cancelling
    stats.monthlySales = Math.max(0, stats.monthlySales - orderAmount);
    stats.monthlyOrders = Math.max(0, stats.monthlyOrders - 1);

    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("Error updating stats on order cancel:", error);
  }
};

export const updateOrderStatus = (id, status) => {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    const oldStatus = orders[index].status;

    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    // If order is being cancelled, update stats
    if (status === "cancelled" && oldStatus !== "cancelled") {
      updateStatsOnOrderCancel(orders[index]);
    }

    return orders[index];
  }
  return null;
};

export const deleteOrder = (id) => {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);
  fs.writeFileSync(ordersFile, JSON.stringify(filtered, null, 2));
  return true;
};

// Monthly archives data file
const archivesFile = path.join(dbPath, "monthly-archives.json");
// Daily archives data file
const dailyArchivesFile = path.join(dbPath, "daily-archives.json");

// Initialize archives files if they don't exist
if (!fs.existsSync(archivesFile)) {
  fs.writeFileSync(archivesFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(dailyArchivesFile)) {
  fs.writeFileSync(dailyArchivesFile, JSON.stringify([], null, 2));
}

// Check if it's the first day of the month and perform monthly reset
const checkAndPerformMonthlyReset = () => {
  try {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Only perform monthly reset on the first day of the month
    if (currentDay !== 1) {
      return false;
    }

    // Read current stats
    const statsData = fs.readFileSync(statsFile, "utf-8");
    const stats = JSON.parse(statsData);

    // Read current orders
    const ordersData = fs.readFileSync(ordersFile, "utf-8");
    const orders = JSON.parse(ordersData);

    // Get previous month info
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Create archive record for previous month
    const archiveRecord = {
      id: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}`,
      month: prevMonth + 1,
      year: prevYear,
      monthlySales: stats.monthlySales,
      monthlyOrders: stats.monthlyOrders,
      ordersCount: orders.length,
      archivedAt: today.toISOString(),
    };

    // Read existing archives
    let archives = [];
    try {
      const archivesData = fs.readFileSync(archivesFile, "utf-8");
      archives = JSON.parse(archivesData);
    } catch (e) {
      archives = [];
    }

    // Add new archive record
    archives.push(archiveRecord);

    // Write updated archives
    fs.writeFileSync(archivesFile, JSON.stringify(archives, null, 2));

    // Archive the orders to a separate file
    const archivedOrdersFile = path.join(
      dbPath,
      `orders-${prevYear}-${String(prevMonth + 1).padStart(2, "0")}.json`,
    );
    fs.writeFileSync(archivedOrdersFile, JSON.stringify(orders, null, 2));

    // Clear current orders
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));

    // Reset stats (keep daily as 0, reset monthly)
    const newStats = {
      dailySales: 0,
      monthlySales: 0,
      dailyOrders: 0,
      monthlyOrders: 0,
      lastUpdated: today.toISOString().split("T")[0],
    };
    fs.writeFileSync(statsFile, JSON.stringify(newStats, null, 2));

    console.log(
      `Monthly reset performed: ${prevYear}-${prevMonth + 1} archived`,
    );
    return true;
  } catch (error) {
    console.error("Error performing monthly reset:", error);
    return false;
  }
};

// Get monthly archives
export const getMonthlyArchives = () => {
  try {
    const data = fs.readFileSync(archivesFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Get daily archives
export const getDailyArchives = () => {
  try {
    const data = fs.readFileSync(dailyArchivesFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Archive daily data and reset daily stats
const performDailyReset = () => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Read current stats
    const statsData = fs.readFileSync(statsFile, "utf-8");
    const stats = JSON.parse(statsData);

    // Only archive if there were sales today
    if (stats.dailySales > 0 || stats.dailyOrders > 0) {
      // Get yesterday's date
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      // Create daily archive record
      const dailyArchiveRecord = {
        id: yesterdayStr,
        date: yesterdayStr,
        dailySales: stats.dailySales,
        dailyOrders: stats.dailyOrders,
        archivedAt: today.toISOString(),
      };

      // Read existing daily archives
      let dailyArchives = [];
      try {
        const dailyArchivesData = fs.readFileSync(dailyArchivesFile, "utf-8");
        dailyArchives = JSON.parse(dailyArchivesData);
      } catch (e) {
        dailyArchives = [];
      }

      // Add new daily archive record
      dailyArchives.push(dailyArchiveRecord);

      // Keep only last 30 days of daily archives
      if (dailyArchives.length > 30) {
        dailyArchives = dailyArchives.slice(-30);
      }

      // Write updated daily archives
      fs.writeFileSync(
        dailyArchivesFile,
        JSON.stringify(dailyArchives, null, 2),
      );

      console.log(
        `Daily archive created: ${yesterdayStr} - Sales: ${stats.dailySales}, Orders: ${stats.dailyOrders}`,
      );
    }

    // Reset daily stats (keep monthly)
    const newStats = {
      dailySales: 0,
      dailyOrders: 0,
      monthlySales: stats.monthlySales,
      monthlyOrders: stats.monthlyOrders,
      lastUpdated: todayStr,
    };
    fs.writeFileSync(statsFile, JSON.stringify(newStats, null, 2));

    return true;
  } catch (error) {
    console.error("Error performing daily reset:", error);
    return false;
  }
};

// Stats operations
const updateStatsOnNewOrder = (order) => {
  try {
    // Check if monthly reset is needed
    checkAndPerformMonthlyReset();

    const statsData = fs.readFileSync(statsFile, "utf-8");
    let stats = JSON.parse(statsData);

    const today = new Date().toISOString().split("T")[0];

    // Reset daily if it's a new day (with daily archive)
    if (stats.lastUpdated !== today) {
      // Archive yesterday's data before resetting
      performDailyReset();
    }

    stats.dailySales += order.totalAmount || 0;
    stats.monthlySales += order.totalAmount || 0;
    stats.dailyOrders += 1;
    stats.monthlyOrders += 1;

    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("Error updating stats:", error);
  }
};

export const getStats = () => {
  try {
    const data = fs.readFileSync(statsFile, "utf-8");
    let stats = JSON.parse(data);

    const today = new Date().toISOString().split("T")[0];

    // Reset daily if it's a new day (with daily archive)
    if (stats.lastUpdated !== today) {
      // Archive yesterday's data before resetting
      performDailyReset();
    }

    return stats;
  } catch (error) {
    return {
      dailySales: 0,
      monthlySales: 0,
      dailyOrders: 0,
      monthlyOrders: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
  }
};

export const resetMonthlyStats = () => {
  try {
    const statsData = fs.readFileSync(statsFile, "utf-8");
    const stats = JSON.parse(statsData);
    stats.monthlySales = 0;
    stats.monthlyOrders = 0;
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    return true;
  } catch (error) {
    return false;
  }
};
