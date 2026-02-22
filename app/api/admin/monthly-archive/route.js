import { NextResponse } from "next/server";
import { getMonthlyArchives, getDailyArchives, getStats } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const monthlyArchives = getMonthlyArchives();
    const dailyArchives = getDailyArchives();
    const currentStats = getStats();

    return NextResponse.json({
      monthlyArchives,
      dailyArchives,
      currentStats,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching archives:", error);
    return NextResponse.json(
      { error: "Failed to fetch archives" },
      { status: 500 },
    );
  }
}

// Manual trigger for testing daily and monthly reset
export async function POST() {
  try {
    const dbPath = path.join(process.cwd(), "data");
    const statsFile = path.join(dbPath, "stats.json");
    const ordersFile = path.join(dbPath, "orders.json");
    const archivesFile = path.join(dbPath, "monthly-archives.json");
    const dailyArchivesFile = path.join(dbPath, "daily-archives.json");

    // Read current stats
    const statsData = fs.readFileSync(statsFile, "utf-8");
    const stats = JSON.parse(statsData);

    // Read current orders
    const ordersData = fs.readFileSync(ordersFile, "utf-8");
    const orders = JSON.parse(ordersData);

    // Get current date for archive record
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

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
      manualTrigger: true,
    };

    // Read existing monthly archives
    let archives = [];
    try {
      const archivesData = fs.readFileSync(archivesFile, "utf-8");
      archives = JSON.parse(archivesData);
    } catch (e) {
      archives = [];
    }

    // Add new monthly archive record
    archives.push(archiveRecord);
    fs.writeFileSync(archivesFile, JSON.stringify(archives, null, 2));

    // Create daily archive for today before resetting
    if (stats.dailySales > 0 || stats.dailyOrders > 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const dailyArchiveRecord = {
        id: yesterdayStr,
        date: yesterdayStr,
        dailySales: stats.dailySales,
        dailyOrders: stats.dailyOrders,
        archivedAt: today.toISOString(),
        manualTrigger: true,
      };

      // Read existing daily archives
      let dailyArchives = [];
      try {
        const dailyArchivesData = fs.readFileSync(dailyArchivesFile, "utf-8");
        dailyArchives = JSON.parse(dailyArchivesData);
      } catch (e) {
        dailyArchives = [];
      }

      dailyArchives.push(dailyArchiveRecord);
      fs.writeFileSync(
        dailyArchivesFile,
        JSON.stringify(dailyArchives, null, 2),
      );
    }

    // Archive the orders to a separate file
    const archivedOrdersFile = path.join(
      dbPath,
      `orders-${prevYear}-${String(prevMonth + 1).padStart(2, "0")}.json`,
    );
    fs.writeFileSync(archivedOrdersFile, JSON.stringify(orders, null, 2));

    // Clear current orders
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));

    // Reset stats
    const newStats = {
      dailySales: 0,
      monthlySales: 0,
      dailyOrders: 0,
      monthlyOrders: 0,
      lastUpdated: todayStr,
    };
    fs.writeFileSync(statsFile, JSON.stringify(newStats, null, 2));

    return NextResponse.json({
      success: true,
      message:
        "Monthly and daily reset performed successfully (manual trigger)",
      archivedData: archiveRecord,
      newStats: newStats,
    });
  } catch (error) {
    console.error("Error performing manual reset:", error);
    return NextResponse.json(
      { error: "Failed to perform reset" },
      { status: 500 },
    );
  }
}
