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
  // const [productImageSearch, setProductImageSearch] = useState(true);
  // const [dragImageFeature, setDragImageFeature] = useState(true);
  // const [useStandalonePage, setUseStandalonePage] = useState(false);
  // const [openInNewTab, setOpenInNewTab] = useState(false);
  // const [showImageSearchButton, setShowImageSearchButton] = useState(true);
  // const [showAddToCartButton, setShowAddToCartButton] = useState(true);
  // const [displayCollectionInfo, setDisplayCollectionInfo] = useState(false);

  const handleProductImageSearchChange = () => {
    setProductImageSearch(!productImageSearch);
  };

  const handleDragImageFeatureChange = () => {
    setDragImageFeature(!dragImageFeature);
  };

  const handleUseStandalonePageChange = () => {
    setUseStandalonePage(!useStandalonePage);
  };

  const handleOpenInNewTabChange = () => {
    setOpenInNewTab(!openInNewTab);
  };

  const handleShowImageSearchButtonChange = () => {
    setShowImageSearchButton(!showImageSearchButton);
  };

  const handleShowAddToCartButtonChange = () => {
    setShowAddToCartButton(!showAddToCartButton);
  };

  const handleDisplayCollectionInfoChange = () => {
    setDisplayCollectionInfo(!displayCollectionInfo);
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

          {/* {productImageSearch && (
            <>
              <Card>
                <BlockStack gap={"400"}>
                  <InlineStack align="space-between">
                    <Text variant="bodyMd">
                      Drag the image onto the website to directly open the
                      "Image Search" box.
                    </Text>
                    <ToggleSwitch
                      checked={dragImageFeature}
                      onChange={handleDragImageFeatureChange}
                    />
                  </InlineStack>

                  <InlineStack align="space-between">
                    <Text variant="bodyMd">
                      Use image search, search results shown on a separate page
                    </Text>
                    <ToggleSwitch
                      checked={useStandalonePage}
                      onChange={handleUseStandalonePageChange}
                    />
                  </InlineStack>
                  {useStandalonePage && (
                    <div style={{ marginTop: "8px" }}>
                      <InlineStack gap="200">
                        <Text variant="bodyMd" color="subdued">
                          Image search standalone page: store url + /apps/birse
                        </Text>
                        <Link url="#" external>
                          View
                        </Link>
                      </InlineStack>
                    </div>
                  )}

                  <InlineStack align="space-between">
                    <Text variant="bodyMd">
                      Open product search results in a "New Tab"
                    </Text>
                    <ToggleSwitch
                      checked={openInNewTab}
                      onChange={handleOpenInNewTabChange}
                    />
                  </InlineStack>
                </BlockStack>
              </Card>

              <Card>
                <InlineStack align="space-between">
                  <Text variant="bodyMd">Show "Image Search" button</Text>
                  <ToggleSwitch
                    checked={showImageSearchButton}
                    onChange={handleShowImageSearchButtonChange}
                  />
                </InlineStack>
                <div style={{ marginTop: "16px" }}>
                  <InlineStack align="space-between">
                    <Text variant="bodyMd">Show "Add to Cart" button</Text>
                    <ToggleSwitch
                      checked={showAddToCartButton}
                      onChange={handleShowAddToCartButtonChange}
                    />
                  </InlineStack>
                </div>
                <div style={{ marginTop: "16px" }}>
                  <InlineStack align="space-between">
                    <Text variant="bodyMd">
                      Display product collection name and image
                    </Text>
                    <ToggleSwitch
                      checked={displayCollectionInfo}
                      onChange={handleDisplayCollectionInfoChange}
                    />
                  </InlineStack>
                </div>
              </Card>
            </>
          )} */}
          {/* </LegacyCard> */}
        </BlockStack>
      </Layout.AnnotatedSection>
    </Layout>
  );
}
