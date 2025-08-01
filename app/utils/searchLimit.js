// utils/search-limits.js

// import prisma from "../db.server";

// Constants for search limits
const VISUAL_SEARCH_LIMITS = {
  DAILY: 2,
  MONTHLY: 1,
};

export async function checkSearchLimits(shopDomain, prisma) {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get today's visual search count
  const dailyCount = await prisma.searchClick.count({
    where: {
      type: "visual_search",
      shopDomain,
      timestamp: { gte: startOfDay },
    },
  });

  // Get this month's visual search count
  const monthlyCount = await prisma.searchClick.count({
    where: {
      type: "visual_search",
      shopDomain,
      timestamp: { gte: startOfMonth },
    },
  });

  // Check if limits exceeded
  if (dailyCount >= VISUAL_SEARCH_LIMITS.DAILY) {
    return json(
      {
        success: false,
        error: "Daily visual search limit exceeded",
        limit: VISUAL_SEARCH_LIMITS.DAILY,
        currentCount: dailyCount,
      },
      { status: 429 },
    );
  }

  if (monthlyCount >= VISUAL_SEARCH_LIMITS.MONTHLY) {
    return json(
      {
        success: false,
        error: "Monthly visual search limit exceeded",
        limit: VISUAL_SEARCH_LIMITS.MONTHLY,
        currentCount: monthlyCount,
      },
      { status: 429 },
    );
  }

  return {
    exceeded: false,
    dailyCount,
    monthlyCount,
  };
}
