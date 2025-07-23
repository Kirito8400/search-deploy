import React, { useState } from "react";
import { BlockStack, Button, Card, Grid, Page, Text } from "@shopify/polaris";
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

  const redirectToThemeEditor = () => {
    window.open(`https://${shopName}.myshopify.com/admin/themes/${liveThemeId}/editor`, '_blank');
  };

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
  // Calculate keyword counts
  const countSearchKeywordData = countSearchKeyword(searchTrackResponse);
  // count visual search
  const countVisualSearchData = countVisualSearch(searchTrackResponse);



  return (
    <Page title="Dashboard">
      <BlockStack gap="400">
        <WelcomeCard redirectToThemeEditor={redirectToThemeEditor} />
        <CurrentPlan />
        <ReviewSection />
        <Statistics searchTrackResponse={searchTrackResponse} countSearchKeywordData={countSearchKeywordData} countVisualSearchData={countVisualSearchData} />
      </BlockStack>
      <br />
      <br />
    </Page>
  );
}
