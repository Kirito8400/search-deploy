import { useFetcher } from "@remix-run/react";
import { Card, Text, Grid, BlockStack, Button, Page, Tabs, Divider, LegacyCard } from "@shopify/polaris";
import { useState, useCallback } from "react";

const plans = [
  {
    name: "Free",
    products: "Up to 100 products",
    keySearches: "Unlimited key searches",
    imageSearches: "1000 image searches",
    recommendedProducts: "Available",
    usage: "Unlimited usage",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    isCurrent: true,
  },
  {
    name: "Pro",
    products: "Unlimited products",
    keySearches: "Unlimited key searches",
    imageSearches: "Unlimited image searches",
    recommendedProducts: "Available",
    usage: "Unlimited usage",
    monthlyPrice: "$5",
    yearlyPrice: "$4",
    isCurrent: false,
  },
];

const Plan = () => {
  const upgradeFetcher = useFetcher(); // Rename existing fetcher for clarity

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "monthly",
      content: "Monthly",
    },
    {
      id: "yearly",
      content: "Yearly",
    },
  ];

  const handleSubscribe = (plan) => {
    // upgradeFetcher.submit(
    //   {
    //     plan,
    //     billingType: "monthly",
    //   },
    //   { method: "post", action: "/api/upgrade-plan" }
    // );
  };

  return (
    <Page title="Plan">
      <BlockStack align="center" gap="400">
        <div className="" style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto" }}>
          <LegacyCard>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "96px", }}>
              <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
            </div>
          </LegacyCard>
        </div>

        {/* </Tabs> */}
        <Grid>
          {plans.map((plan) => (
            <Grid.Cell key={plan.name} columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Card padding="400">
                <div className="" style={{ minHeight: "400px", display: "flex", flexDirection: "column", padding: "10px" }}>
                  <BlockStack gap="200">
                    <div className="" style={{ minHeight: "90px" }}>
                      <Text variant="headingMd" as="h2">
                        {plan.name}
                        {plan.isCurrent && (
                          <Text variant="bodyMd" as="span" color="success">
                            {" "}(Current Plan)
                          </Text>
                        )}
                      </Text>

                      <Text variant="heading2xl" as="p">
                        {selectedTab === 0 ? `${plan.monthlyPrice}` : `${plan.yearlyPrice}`}
                        {selectedTab === 0 && plan.monthlyPrice !== "$0" && (
                          <Text variant="bodyMd" as="span" color="subdued">
                            {/* / month */}
                          </Text>
                        )}
                        <Text variant="bodyMd" as="span" color="subdued">
                          / month
                        </Text>
                      </Text>

                      {plan.monthlyPrice !== "$0" && (
                        <Text variant="bodyMd" color="subdued">
                          {selectedTab === 0
                            ? `Billed monthly (${plan.monthlyPrice})`
                            : `Billed annually ($${parseInt(plan.yearlyPrice.substring(1)) * 12}) - Save ${Math.round((1 - parseInt(plan.yearlyPrice.substring(1)) / parseInt(plan.monthlyPrice.substring(1))) * 100)}%`}
                        </Text>
                      )}

                    </div>

                    <Divider />

                    <div className="" style={{ minHeight: '300px', display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
                      <BlockStack gap="100">
                        <Text variant="bodyMd" color="subdued">
                          Number of Products: {plan.products}
                        </Text>
                        <Text variant="bodyMd" color="subdued">
                          Monthly Keyword Searches: {plan.keySearches}
                        </Text>
                        <Text variant="bodyMd" color="subdued">
                          Monthly Image Searches: {plan.imageSearches}
                        </Text>
                        <Text variant="bodyMd" color="subdued">
                          Show recommended products: {plan.recommendedProducts}
                        </Text>
                      </BlockStack>

                      {!plan.isCurrent && plan.monthlyPrice !== "$0" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                          <Button fullWidth variant="primary" onClick={handleSubscribe("pro_plan")} >
                            {selectedTab === 0 ? "Upgrade plan" : "Get yearly plan"}
                          </Button>
                          {/* <Text variant="bodyMd" color="subdued">14 days Free trail Available</Text> */}
                        </div>
                      )}
                    </div>
                  </BlockStack>
                </div>
              </Card>
            </Grid.Cell>
          ))}
        </Grid>
      </BlockStack>
      <br />
      <br />
    </Page>
  );
};

export default Plan;