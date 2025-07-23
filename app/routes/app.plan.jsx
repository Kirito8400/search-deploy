import { useFetcher, useLoaderData } from "@remix-run/react";
import { Card, Text, Grid, BlockStack, Button, Page, Tabs, Divider, LegacyCard, Banner, Modal } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { authenticate, PRO_ANNUAL_PLAN, PRO_PLAN } from "../shopify.server";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const hasActivePayment = await billing.check({
    plans: [PRO_PLAN, PRO_ANNUAL_PLAN],
    isTest: true,
  });

  const CurrentPlan = hasActivePayment?.appSubscriptions[0]?.name || "";
  const isProMonthly = CurrentPlan === "Monthly subscription";
  const isProAnnual = CurrentPlan === "Annual subscription";
  
  return { 
    success: true, 
    CurrentPlan,
    isProMonthly,
    isProAnnual
  };
};

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
  const { CurrentPlan, isProMonthly, isProAnnual } = useLoaderData();
  const upgradeFetcher = useFetcher();
  const cancelFetcher = useFetcher();
  
  const [selectedTab, setSelectedTab] = useState(isProAnnual ? 1 : 0);
  const [activeModal, setActiveModal] = useState(false);

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

  const handleSubscribe = useCallback((plan) => {
    return () => {
      upgradeFetcher.submit(
        {
          plan,
          billingType: selectedTab === 0 ? "monthly" : "yearly",
        },
        { method: "post", action: "/api/upgrade-plan" }
      );
    };
  }, [selectedTab, upgradeFetcher]);

  const handleCancel = useCallback(() => {
    const plan = selectedTab === 0 ? "pro_plan" : "pro_plan_annual";
    const billingType = selectedTab === 0 ? "monthly" : "yearly";
    
    cancelFetcher.submit(
      {
        plan,
        billingType,
      },
      { method: "post", action: "/api/cancel-plan" }
    );
    setActiveModal(false);
  }, [selectedTab, cancelFetcher]);

  const handleCancelClick = useCallback(() => {
    setActiveModal(true);
  }, []);

  return (
    <Page title="Plan">
      {CurrentPlan && (
        <>
          <Banner
            title={`You are currently subscribed to the "${CurrentPlan}"`}
            tone="success"
          >
            <Button
              onClick={handleCancelClick}
              loading={cancelFetcher.state === "submitting"}
              disabled={cancelFetcher.state === "submitting"}
              variant="primary"
            >
              Cancel Subscription
            </Button>
          </Banner>
          <br />
        </>
      )}
      
      <Modal
        open={activeModal}
        onClose={() => setActiveModal(false)}
        title="Cancel Subscription"
        primaryAction={{
          content: 'Confirm Cancel',
          destructive: true,
          onAction: handleCancel,
          loading: cancelFetcher.state === "submitting",
        }}
        secondaryActions={[
          {
            content: 'Back',
            onAction: () => setActiveModal(false),
          },
        ]}
      >
        <Modal.Section>
          <Text variant="bodyMd">
            Are you sure you want to cancel your subscription? 
            You'll lose access to Pro features at the end of your billing period.
          </Text>
        </Modal.Section>
      </Modal>

      <BlockStack align="center" gap="400">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "auto" }}>
          <LegacyCard>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "96px" }}>
              <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange} />
            </div>
          </LegacyCard>
        </div>

        <Grid>
          {plans.map((plan) => (
            <Grid.Cell key={plan.name} columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Card padding="400">
                <div style={{ minHeight: "400px", display: "flex", flexDirection: "column", padding: "10px" }}>
                  <BlockStack gap="200">
                    <div style={{ minHeight: "90px" }}>
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

                    <div style={{ minHeight: '300px', display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
                          <Button
                            fullWidth
                            variant="primary"
                            onClick={handleSubscribe(selectedTab === 0 ? "pro_plan" : "pro_plan_annual")}
                            loading={upgradeFetcher.state === "submitting"}
                            disabled={
                              (selectedTab === 0 && isProMonthly) || 
                              (selectedTab === 1 && isProAnnual)
                            }
                          >
                            {selectedTab === 0 ? "Upgrade plan" : "Get yearly plan"}
                          </Button>
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