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
  const responseData = await response.json();

  const liveTheme = responseData?.data?.themes.edges.find(theme => theme.node.role === "MAIN");
  const shopName = session.shop.replace(".myshopify.com", "");
  const liveThemeId = liveTheme?.node?.id.replace("gid://shopify/OnlineStoreTheme/", "");

  // console.log("liveThemeId", liveThemeId);
  // console.log("shopName", shopName)

  return { liveThemeId: liveThemeId, shopName: shopName };
}

export default function Dashboard() {
  const { liveThemeId, shopName } = useLoaderData();

  const redirectToThemeEditor = () => {
    window.open(`https://${shopName}.myshopify.com/admin/themes/${liveThemeId}/editor`, '_blank');
  };

  return (
    <Page title="Dashboard">
      <BlockStack gap="400">
        <WelcomeCard redirectToThemeEditor={redirectToThemeEditor} />
        <CurrentPlan />
        {/* <ProductStatus /> */}
        <ReviewSection />
        <Statistics />
      </BlockStack>
      <br />
      <br />
    </Page>
  );
}
