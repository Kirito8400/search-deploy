import React, { useState } from "react";
import {
  Layout,
  Text,
  InlineStack,
  Select,
  Divider,
  LegacyCard,
} from "@shopify/polaris";

export default function AllSettings({hideOutOfStock, setHideOutOfStock, selectorStyle, setSelectorStyle }) {

  const handleHideOutOfStockChange = () => {
    setHideOutOfStock(!hideOutOfStock);
  };

  const handleSelectorStyleChange = (value) => {
    setSelectorStyle(value);
  };

  const selectorOptions = [
    { label: "Button", value: "button" },
    { label: "Dropdown", value: "dropdown" },
    { label: "Tabs", value: "tabs" },
  ];

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
    slider: {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: hideOutOfStock ? "#008060" : "#BABFC4",
      borderRadius: "12px",
      transition: "background-color 0.2s ease",
    },
    knob: {
      position: "absolute",
      content: '""',
      height: "20px",
      width: "20px",
      left: hideOutOfStock ? "22px" : "2px",
      bottom: "2px",
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "left 0.2s ease",
    },
  };

  return (
    <Layout>
      <Layout.AnnotatedSection
        id="allDetails"
        title="All settings"
        description={`Apply to "Product Recommendations", "Product Image Search" and "Search Recommendations."`}
      >
        <LegacyCard sectioned>
          {/* <div style={{ paddingBottom: "8px" }}>
            <InlineStack align="space-between">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Hide out-of-stock products
              </Text>
              <div
                style={toggleSwitchStyles.container}
                onClick={handleHideOutOfStockChange}
              >
                <input
                  type="checkbox"
                  checked={hideOutOfStock}
                  onChange={handleHideOutOfStockChange}
                  style={toggleSwitchStyles.input}
                />
                <span style={toggleSwitchStyles.slider}>
                  <span style={toggleSwitchStyles.knob}></span>
                </span>
              </div>
            </InlineStack>
          </div>
          <Divider /> */}
          <div style={{ paddingTop: "8px" }}>
            <InlineStack blockAlign="center" align="space-between">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Add to cart : subcategory selector style
              </Text>
              <Select
                options={selectorOptions}
                value={selectorStyle}
                onChange={handleSelectorStyleChange}
                labelHidden
              />
            </InlineStack>
          </div>
        </LegacyCard>
      </Layout.AnnotatedSection>
    </Layout>
  );  
}
