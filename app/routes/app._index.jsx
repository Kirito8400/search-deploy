import { BlockStack, Page } from "@shopify/polaris";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import { CurrentPlan } from "../components/dashboard/CurrentPlan";
import { Statistics } from "../components/dashboard/Statistics";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";
import {
  extractThemeId,
  fetchShopThemes,
  findLiveTheme,
} from "../utils/shopThemes";
import { fetchBillingStatus } from "../utils/fetchBillingStatus";
import { checkAppEmbed } from "../utils/checkAppEmbed";

function extractShopName(shopDomain) {
  return shopDomain.replace(".myshopify.com", "");
}

export async function loader({ request }) {
  try {
    // Authenticate and get admin/session
    const { admin, session } = await authenticate.admin(request);

    // Fetch shop themes
    const themes = await fetchShopThemes(admin);
    const liveTheme = findLiveTheme(themes);
    const liveThemeId = extractThemeId(liveTheme?.node?.id);

    // check app embed
    const isEmbedded = await checkAppEmbed(admin);

    // Check is plan upgraded
    const billingStatus = await fetchBillingStatus(request);
    const isPlanUpgraded = billingStatus?.CurrentPlan || "";

    // Fetch search tracking data
    const searchTrackResponse = await prisma.searchClick.findMany(
      {
        where: {
          shopDomain: session.shop,
        },
      }
    );

    // Process shop name
    const shopName = extractShopName(session.shop);

    return {
      liveThemeId,
      shopName,
      searchTrackResponse,
      isEmbedded,
      isPlanUpgraded,
      billingStatus,
    };
  } catch (error) {
    console.error("Error in loader function:", error);
    throw error; // Or handle it appropriately for your use case
  }
}

export default function Dashboard() {
  const {
    liveThemeId,
    shopName,
    searchTrackResponse,
    isEmbedded,
    isPlanUpgraded,
    billingStatus,
  } = useLoaderData();

  console.log(billingStatus);

  const redirectToThemeEditor = () => {
    window.open(
      `https://${shopName}.myshopify.com/admin/themes/${liveThemeId}/editor?context=apps`,
      "_blank",
    );
  };

  function countSearchKeyword(searchTrackResponse) {
    // Create objects to store counts per date for each category
    // const visualSearchCounts = {};
    const recentSearchCounts = {};
    const popularQueryCounts = {};

    // Find the most recent date in the data
    let latestDate = null;

    searchTrackResponse.forEach((item) => {
      const dateObj = new Date(item.timestamp);
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const dateKey = `${month}-${day}`;

      // Track latest date
      if (!latestDate || dateObj > latestDate) {
        latestDate = dateObj;
      }

      // Count by type
      if (item.type === "recent_search") {
        recentSearchCounts[dateKey] = (recentSearchCounts[dateKey] || 0) + 1;
      } else if (
        item.type === "popular_query" ||
        item.type === "popular_product"
      ) {
        popularQueryCounts[dateKey] = (popularQueryCounts[dateKey] || 0) + 1;
      }
    });

    // If no data, use today as latest date
    if (!latestDate) {
      latestDate = new Date();
    }

    // Set end date to the day of latest date (time set to 00:00:00)
    const endDate = new Date(latestDate);
    endDate.setHours(0, 0, 0, 0);

    // Set start date to 6 days before end date (for 7 days total)
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    // Generate all dates in the 7-day range
    const result = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dateKey = `${month}-${day}`;

      result.push({
        date: dateKey,
        // visualSearch: visualSearchCounts[dateKey] || 0,
        recentSearch: recentSearchCounts[dateKey] || 0,
        popularQuery: popularQueryCounts[dateKey] || 0,
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }
  function countVisualSearch(searchTrackResponse) {
    // Create objects to store counts per date for each category
    // const popularQueryCounts = {};
    const visualSearchCounts = {};

    // Find the most recent date in the data
    let latestDate = null;

    searchTrackResponse.forEach((item) => {
      const dateObj = new Date(item.timestamp);
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const dateKey = `${month}-${day}`;

      // Track latest date
      if (!latestDate || dateObj > latestDate) {
        latestDate = dateObj;
      }

      // Count by type
      // else if (item.type === 'popular_query' || item.type === 'popular_product') {
      //   popularQueryCounts[dateKey] = (popularQueryCounts[dateKey] || 0) + 1;
      // }

      if (item.type === "visual_search") {
        visualSearchCounts[dateKey] = (visualSearchCounts[dateKey] || 0) + 1;
      }
    });

    // If no data, use today as latest date
    if (!latestDate) {
      latestDate = new Date();
    }

    // Set end date to the day of latest date (time set to 00:00:00)
    const endDate = new Date(latestDate);
    endDate.setHours(0, 0, 0, 0);

    // Set start date to 6 days before end date (for 7 days total)
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    // Generate all dates in the 7-day range
    const result = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dateKey = `${month}-${day}`;

      result.push({
        date: dateKey,
        visualSearch: visualSearchCounts[dateKey] || 0,
        // popularQuery: popularQueryCounts[dateKey] || 0
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }
  // Calculate keyword counts
  const countSearchKeywordData = countSearchKeyword(searchTrackResponse);
  // count visual search
  const countVisualSearchData = countVisualSearch(searchTrackResponse);

  return (
    <Page title="Dashboard">
      <BlockStack gap="400">
        <WelcomeCard
          redirectToThemeEditor={redirectToThemeEditor}
          isEmbeddedApp={isEmbedded}
          isPlanUpgraded={billingStatus?.CurrentPlan}
        />
        <CurrentPlan billingStatus={billingStatus} />
        {/* <ReviewSection /> */}
        <Statistics
          searchTrackResponse={searchTrackResponse}
          countSearchKeywordData={countSearchKeywordData}
          countVisualSearchData={countVisualSearchData}
          billingStatus={billingStatus}
        />
      </BlockStack>
      <br />
      <br />
    </Page>
  );
}
