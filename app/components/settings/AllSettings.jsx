import React, { useState } from "react";
import {
  Layout,
  Text,
  InlineStack,
  Select,
  Divider,
  LegacyCard,
  Card,
  BlockStack,
  TextField,
} from "@shopify/polaris";

export default function AllSettings({
  hideOutOfStock,
  setHideOutOfStock,
  selectorStyle,
  setSelectorStyle,
  RecommendedImageSearchPerRow,
  setRecommendedImageSearchPerRow,
  RecommendedImageAspectRatio,
  setRecommendedImageAspectRatio,
  RecommendedImageBorderRadius,
  setRecommendedImageBorderRadius,
}) {
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

  // Toggle switch component
  const ToggleSwitch = ({ checked, onChange }) => (
    <div style={toggleSwitchStyles.container} onClick={onChange}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={toggleSwitchStyles.input}
      />
      <span
        style={{
          ...toggleSwitchStyles.slider,
          backgroundColor: checked ? "#008060" : "#BABFC4",
        }}
      >
        <span
          style={{
            ...toggleSwitchStyles.knob,
            left: checked ? "22px" : "2px",
          }}
        ></span>
      </span>
    </div>
  );

  // const [RecommendedImageSearchPerRow, setRecommendedImageSearchPerRow] = useState(6);
  // const [RecommendedImageAspectRatio, setRecommendedImageAspectRatio] = useState('portrait');
  // const [RecommendedImageBorderRadius, setRecommendedImageBorderRadius] = useState(4);

  const recommendedImageAspectRatioOptions = [
    { label: "Portrait", value: "portrait" },
    { label: "Square", value: "square" },
    { label: "Landscape", value: "landscape" },
  ];

  return (
    <Layout>
      <Layout.AnnotatedSection
        id="allDetails"
        title="All settings"
        description={`Apply to "Product Recommendations", "Product Image Search" and "Search Recommendations."`}
      >
        <BlockStack gap="400">
          <LegacyCard sectioned>
            <div style={{ paddingBottom: "0px" }}>
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
          </LegacyCard>

          {/* Popualar Image Search */}
          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Recommended Image Search
              </Text>
              <BlockStack gap="200">
                {/* <InlineStack align="space-between"> */}
                <Text variant="bodyMd">No. of Images per row</Text>
                <TextField
                  type="number"
                  min={4}
                  max={12}
                  label=""
                  value={RecommendedImageSearchPerRow}
                  onChange={(value) => setRecommendedImageSearchPerRow(value)}
                  autoComplete="off"
                  placeholder="6"
                />
                {/* </InlineStack> */}
                {/* Image Aspect  Ratio */}
                {/* <InlineStack align="space-between"> */}
                <Text variant="bodyMd">Image Aspect Ratio</Text>
                <Select
                  options={recommendedImageAspectRatioOptions}
                  value={RecommendedImageAspectRatio}
                  onChange={(value) => setRecommendedImageAspectRatio(value)}
                  label=""
                />
                {/* </InlineStack> */}
                {/* Image Border Radius */}
                {/* <InlineStack align="space-between"> */}
                <Text variant="bodyMd">Image Border Radius</Text>
                <TextField
                  type="number"
                  min={0}
                  max={12}
                  label=""
                  value={RecommendedImageBorderRadius}
                  onChange={(value) => setRecommendedImageBorderRadius(value)}
                  autoComplete="off"
                  placeholder="12"
                />
                {/* </InlineStack> */}
              </BlockStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </Layout.AnnotatedSection>
    </Layout>
  );
}
