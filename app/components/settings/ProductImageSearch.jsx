import React, { useState } from "react";
import {
  Layout,
  Text,
  InlineStack,
  Link,
  LegacyCard,
  Card,
  BlockStack,
} from "@shopify/polaris";

export default function ProductImageSearch({
  productImageSearch,
  setProductImageSearch,
  dragImageFeature,
  setDragImageFeature,
  useStandalonePage,
  setUseStandalonePage,
  openInNewTab,
  setOpenInNewTab,
  showImageSearchButton,
  setShowImageSearchButton,
  showAddToCartButton,
  setShowAddToCartButton,
  displayCollectionInfo,
  setDisplayCollectionInfo,
}) {

  const handleProductImageSearchChange = () => {
    setProductImageSearch(!productImageSearch);
  };

  // Custom toggle switch styles
  const toggleSwitchStyles = {
    container: {
      position: "relative",
      display: "inline-block",
      width: "44px",
      height: "24px",
    },
    input: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    slider: (checked) => ({
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: checked ? "#008060" : "#BABFC4",
      borderRadius: "12px",
      transition: "background-color 0.2s ease",
    }),
    knob: (checked) => ({
      position: "absolute",
      content: '""',
      height: "20px",
      width: "20px",
      left: checked ? "22px" : "2px",
      bottom: "2px",
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "left 0.2s ease",
    }),
  };

  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange }) => (
    <div style={toggleSwitchStyles.container} onClick={onChange}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={toggleSwitchStyles.input}
      />
      <span style={toggleSwitchStyles.slider(checked)}>
        <span style={toggleSwitchStyles.knob(checked)}></span>
      </span>
    </div>
  );

  return (
    <Layout>
      <Layout.AnnotatedSection
        id="productImageSearch"
        title="Float Image Search"
        description={
          'Float Image Search is a feature that uses AI to automatically recommend products of the similar style.'
        }
      >
        <BlockStack gap={"400"}>
          {/* <LegacyCard> */}
          {/* <LegacyCard.Section sectioned> */}
          <Card>
            <InlineStack align="space-between">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Floating Image Search
              </Text>
              <ToggleSwitch
                checked={productImageSearch}
                onChange={handleProductImageSearchChange}
              />
            </InlineStack>
          </Card>
        </BlockStack>
      </Layout.AnnotatedSection>
    </Layout>
  );
}
