import React, { useState } from "react";
import { BlockStack, Button, Card, Page, Text } from "@shopify/polaris";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import {
  CurrentPlan,
  ProductStatus,
  ReviewSection,
} from "../components/dashboard/CurrentPlan";
import { Statistics } from "../components/dashboard/Statistics";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";

// import { format, parseISO } from 'date-fns';


export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request); // Your Shopify Admin API client
  const response = await admin.graphql(
    `query{
      themes(first: 10) {
        edges {
          node { 
            id
            name
            role
          }
        }
      }
    }`
  );

  const searchTrackResponse = await prisma.searchClick.findMany();

  const responseShopData = await response.json();

  const liveTheme = responseShopData?.data?.themes.edges.find(theme => theme.node.role === "MAIN");
  const shopName = session.shop.replace(".myshopify.com", "");
  const liveThemeId = liveTheme?.node?.id.replace("gid://shopify/OnlineStoreTheme/", "");

  return { liveThemeId: liveThemeId, shopName: shopName, searchTrackResponse: searchTrackResponse };
}

export default function Dashboard() {
  const { liveThemeId, shopName, searchTrackResponse } = useLoaderData();

  console.log("searchTrackResponse", searchTrackResponse)

  const redirectToThemeEditor = () => {
    window.open(`https://${shopName}.myshopify.com/admin/themes/${liveThemeId}/editor`, '_blank');
  };

  // const searchTrackResponsee = [
  //   {
  //     id: "cmdd2cl380000zt0vj4fn04x9",
  //     type: "recent_search",
  //     timestamp: "2025-07-21T12:09:45.384Z"
  //   },
  //   {
  //     id: "cmdd2clhs0001zt0vid499scl",
  //     type: "popular_query",
  //     timestamp: "2025-07-21T12:09:45.385Z"
  //   },
  //   {
  //     id: "cmdd2d37m0002zt0v89e3x5um",
  //     type: "recent_search",
  //     timestamp: "2025-07-21T12:10:08.830Z"
  //   },
  //   {
  //     id: "cmdd2d4gr0003zt0v6del3m5x",
  //     type: "popular_query",
  //     timestamp: "2025-07-21T12:10:09.795Z"
  //   },
  //   {
  //     id: "cmdd6gudv0000030vdole35rz",
  //     type: "popular_query",
  //     timestamp: "2025-07-21T14:05:01.339Z"
  //   },
  //   {
  //     id: "cmdd6hw8c0001030vwod2wk1u",
  //     type: "visual_search",
  //     timestamp: "2025-07-21T14:05:50.394Z"
  //   },
  //   {
  //     id: "cmdd6hwdt0002030vv338y5cn",
  //     type: "popular_product",
  //     timestamp: "2025-07-21T14:05:50.582Z"
  //   }
  // ];

  // Step 1: Get counts per date
  // const dateCountMap = {};

  // searchTrackResponse.forEach(item => {
  //   const dateObj = new Date(item.timestamp);
  //   const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  //   const day = String(dateObj.getDate()).padStart(2, '0');
  //   const date = `${month}-${day}`;

  //   if (!dateCountMap[date]) {
  //     dateCountMap[date] = { value: 0, visual: 0 };
  //   }

  //   if (item.type === "recent_search" || item.type === "popular_query") {
  //     dateCountMap[date].value += 1;
  //   } else if (item.type === "visual_search") {
  //     dateCountMap[date].visual += 1;
  //   }
  // });

  // // Step 2: Format results
  // const targetDates = Object.keys(dateCountMap);
  // const searchData = targetDates.map(date => ({
  //   date,
  //   value: dateCountMap[date].value,
  //   visual: dateCountMap[date].visual,
  // }));

  // console.log("count", { targetDates, searchData });


  // Example usage:
  const searchTrackResponsee = [
    {
      "id": "cmdd2cl380000zt0vj4fn04x9",
      "type": "recent_search",
      "query": "jack",
      "productId": null,
      "shopDomain": "lathe-base.myshopify.com",
      "timestamp": "2025-07-21T12:09:45.384Z"
    },
    {
      "id": "cmdd2clhs0001zt0vid499scl",
      "type": "popular_query",
      "query": "jack",
      "productId": null,
      "shopDomain": "lathe-base.myshopify.com",
      "timestamp": "2025-07-21T12:09:45.385Z"
    },
    {
      "id": "cmdd2d37m0002zt0v89e3x5um",
      "type": "recent_search",
      "query": "jack",
      "productId": null,
      "shopDomain": "lathe-base.myshopify.com",
      "timestamp": "2025-07-21T12:10:08.830Z"
    },
    {
      "id": "cmdd2d4gr0003zt0v6del3m5x",
      "type": "popular_query",
      "query": "jack",
      "productId": null,
      "shopDomain": "lathe-base.myshopify.com",
      "timestamp": "2025-07-21T12:10:09.795Z"
    },
    {
      "id": "cmdd6gudv0000030vdole35rz",
      "type": "popular_query",
      "query": "Hose Down T-shirt",
      "productId": null,
      "shopDomain": "lathe-base.myshopify.com",
      "timestamp": "2025-07-21T14:05:01.339Z"
    },
    {
      "id": "cmdd6hw8c0001030vwod2wk1u",
      "type": "visual_search",
      "query": "image_searched",
      "productId": null,
      "shopDomain": "lathe-base.myshopify.com",
      "timestamp": "2025-07-21T14:05:50.394Z"
    },
    {
      "id": "cmdd6hwdt0002030vv338y5cn",
      "type": "popular_product",
      "query": "monsoon-nunatak-smock",
      "productId": null,
      "shopDomain": "lathe-base.myshopify.com",
      "timestamp": "2025-07-21T14:05:50.582Z"
    }
  ];

  function countSearchKeyword(searchTrackResponse) {
    // Create objects to store counts per date for each category
    // const visualSearchCounts = {};
    const recentSearchCounts = {};
    const popularQueryCounts = {};

    // Find the most recent date in the data
    let latestDate = null;

    searchTrackResponse.forEach(item => {
      const dateObj = new Date(item.timestamp);
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const dateKey = `${month}-${day}`;

      // Track latest date
      if (!latestDate || dateObj > latestDate) {
        latestDate = dateObj;
      }

      // Count by type
      if (item.type === 'recent_search') {
        recentSearchCounts[dateKey] = (recentSearchCounts[dateKey] || 0) + 1;
      }
      else if (item.type === 'popular_query' || item.type === 'popular_product') {
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
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateKey = `${month}-${day}`;

      result.push({
        date: dateKey,
        // visualSearch: visualSearchCounts[dateKey] || 0,
        recentSearch: recentSearchCounts[dateKey] || 0,
        popularQuery: popularQueryCounts[dateKey] || 0
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  // Calculate keyword counts
  const countSearchKeywordData = countSearchKeyword(searchTrackResponse);
  // console.log(countSearchKeywordData);

  function countVisualSearch(searchTrackResponse) {
    // Create objects to store counts per date for each category
    // const popularQueryCounts = {};
    const visualSearchCounts = {};

    // Find the most recent date in the data
    let latestDate = null;

    searchTrackResponse.forEach(item => {
      const dateObj = new Date(item.timestamp);
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const dateKey = `${month}-${day}`;

      // Track latest date
      if (!latestDate || dateObj > latestDate) {
        latestDate = dateObj;
      }

      // Count by type
      // else if (item.type === 'popular_query' || item.type === 'popular_product') {
      //   popularQueryCounts[dateKey] = (popularQueryCounts[dateKey] || 0) + 1;
      // }

      if (item.type === 'visual_search') {
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
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
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

  // count visual search
  const countVisualSearchData = countVisualSearch(searchTrackResponse);
  // console.log(countVisualSearchData);



  return (
    <Page title="Dashboard">
      <BlockStack gap="400">
        <WelcomeCard redirectToThemeEditor={redirectToThemeEditor} />
        <CurrentPlan />
        {/* <ProductStatus /> */}
        <ReviewSection />
        <Statistics searchTrackResponse={searchTrackResponse} countSearchKeywordData={countSearchKeywordData} countVisualSearchData={countVisualSearchData} />
      </BlockStack>
      <br />
      <br />
    </Page>
  );
}

// searchTrackResponse: [
//     {
//         "id": "cmdd2cl380000zt0vj4fn04x9",
//         "type": "recent_search",
//         "query": "jack",
//         "productId": null,
//         "shopDomain": "lathe-base.myshopify.com",
//         "timestamp": "2025-07-21T12:09:45.384Z"
//     },
//     {
//         "id": "cmdd2clhs0001zt0vid499scl",
//         "type": "popular_query",
//         "query": "jack",
//         "productId": null,
//         "shopDomain": "lathe-base.myshopify.com",
//         "timestamp": "2025-07-21T12:09:45.385Z"
//     },
//     {
//         "id": "cmdd2d37m0002zt0v89e3x5um",
//         "type": "recent_search",
//         "query": "jack",
//         "productId": null,
//         "shopDomain": "lathe-base.myshopify.com",
//         "timestamp": "2025-07-21T12:10:08.830Z"
//     },
//     {
//         "id": "cmdd2d4gr0003zt0v6del3m5x",
//         "type": "popular_query",
//         "query": "jack",
//         "productId": null,
//         "shopDomain": "lathe-base.myshopify.com",
//         "timestamp": "2025-07-21T12:10:09.795Z"
//     },
//     {
//         "id": "cmdd6gudv0000030vdole35rz",
//         "type": "popular_query",
//         "query": "Hose Down T-shirt",
//         "productId": null,
//         "shopDomain": "lathe-base.myshopify.com",
//         "timestamp": "2025-07-21T14:05:01.339Z"
//     },
//     {
//         "id": "cmdd6hw8c0001030vwod2wk1u",
//         "type": "visual_search",
//         "query": "image_searched",
//         "productId": null,
//         "shopDomain": "lathe-base.myshopify.com",
//         "timestamp": "2025-07-21T14:05:50.394Z"
//     },
//     {
//         "id": "cmdd6hwdt0002030vv338y5cn",
//         "type": "popular_product",
//         "query": "monsoon-nunatak-smock",
//         "productId": null,
//         "shopDomain": "lathe-base.myshopify.com",
//         "timestamp": "2025-07-21T14:05:50.582Z"
//     }
// ]