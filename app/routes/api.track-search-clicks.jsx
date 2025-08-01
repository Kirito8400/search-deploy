import { json } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { fetchBillingStatus } from "../utils/fetchBillingStatus";

export async function action({ request }) {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) {
    return json({ error: "No session found" }, { status: 401 });
  }

  const data = await request.json();
  const { type, query, shopDomain } = data;

  // Check is plan upgraded
  // Constants for search limits
  let VISUAL_SEARCH_LIMITS = {
    DAILY: 100,
    MONTHLY: 1000,
  };
  
  //   const billingStatus = await fetchBillingStatus(request);
  //   const isPlanUpgraded = billingStatus?.CurrentPlan || "";
  //   console.log("isPlanUpgraded", isPlanUpgraded);
  //   if (isPlanUpgraded === "") {
  //     VISUAL_SEARCH_LIMITS = {
  //       DAILY: 300,
  //       MONTHLY: 10000,
  //     };
  //   }

  try {
    // Only check limits for visual searches
    if (type === "visual_search") {
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
    }

    // Record the search
    await prisma.searchClick.create({
      data: {
        type,
        query,
        productId: data.productId || null,
        shopDomain,
        timestamp: new Date(),
      },
    });

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error tracking search click:", error);
    return json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
