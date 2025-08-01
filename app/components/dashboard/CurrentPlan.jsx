import React, { useEffect, useState } from "react";
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Icon,
} from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";

export function CurrentPlan({ billingStatus }) {
  const [noOfProducts, setNoOfProducts] = useState(100);

  useEffect(() => {
    if (billingStatus?.isProMonthly) {
      setNoOfProducts(1000);
    } else if (billingStatus?.isProAnnual) {
      setNoOfProducts("Unlimited");
    }
  }, [billingStatus]);


  return (
    <Card>
      <BlockStack gap="200">
        <div className="" style={{ marginBottom: "10px" }}>
          <InlineStack align="space-between" blockAlign="center" wrap={false}>
            <Text variant="headingMd" fontWeight="bold" as="h3">
              Current plan
            </Text>
            <InlineStack gap="200" align="center" wrap={false}>
              <Text variant="bodyMd" as="p">
                {billingStatus?.isProMonthly
                  ? "Pro Monthly"
                  : billingStatus?.isProAnnual
                    ? "Pro Annual"
                    : "Free"}
              </Text>
              {!billingStatus?.isProMonthly ||
                (!billingStatus?.isProAnnual && (
                  <Badge size="slim">Upgrade</Badge>
                ))}
            </InlineStack>
          </InlineStack>
        </div>

        <InlineStack align="space-between" blockAlign="center" wrap={false}>
          <Text variant="bodyMd" as="p" fontWeight="semibold">
            Number of Query Searches
          </Text>
          <Text variant="bodyMd" as="p">
            Unlimited search times
          </Text>
        </InlineStack>

        <InlineStack align="space-between" blockAlign="center" wrap={false}>
          <Text variant="bodyMd" as="p" fontWeight="semibold">
            Number of Products
          </Text>
          <Text variant="bodyMd" as="p">
            {noOfProducts === "Unlimited"
              ? "Unlimited products"
              : `Up to ${noOfProducts} products`}
          </Text>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

export function ProductStatus() {
  const resourcePicker = () => {
    shopify.resourcePicker({
      type: "product",
      filter: {
        hidden: false,
        variants: false,
        draft: false,
        archived: false,
      },
    });
  };
  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="headingMd" fontWeight="bold" as="h3">
          Product status
        </Text>
        <Text variant="bodyMd" as="p" color="subdued">
          Used 4 items / In progress 0 items
        </Text>
        <div>
          <Button variant="primary" onClick={resourcePicker}>
            Select products to use Visual Search
          </Button>
        </div>
      </BlockStack>
    </Card>
  );
}

export function ReviewSection() {
  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between">
          <Text variant="headingMd" fontWeight="bold" as="h3">
            Do you like BIRSE: Visual Search?
          </Text>
          <Button plain icon={<Icon source={XIcon} />} />
        </InlineStack>
        <Text variant="bodyMd" as="p">
          Feel free to leave a review to support our team!
        </Text>
        <div>
          <Button>⭐ Review BIRSE: Visual Search ⭐</Button>
        </div>
      </BlockStack>
    </Card>
  );
}
