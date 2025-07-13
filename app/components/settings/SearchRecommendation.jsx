import React, { useState } from "react";
import {
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Select,
  Checkbox,
  RadioButton,
  TextField,
} from "@shopify/polaris";
import { useCallback } from "react";

// Search recommendations settings section
export default function SearchRecommendationsSettings({
  searchRecommendations,
  setSearchRecommendations,
  customHotKeywords,
  setCustomHotKeywords,
  customHotCollections,
  setCustomHotCollections,
  keywordMenu,
  setKeywordMenu,
  collectionMenu,
  setCollectionMenu,
  samplingInterval,
  setSamplingInterval,
  showKeywordRecommendations,
  setShowKeywordRecommendations,
  showCollectionRecommendations,
  setShowCollectionRecommendations,
}) {
  // const [searchRecommendations, setSearchRecommendations] = useState(true);
  // const [customHotKeywords, setCustomHotKeywords] = useState(false);
  // const [customHotCollections, setCustomHotCollections] = useState(false);
  // const [keywordMenu, setKeywordMenu] = useState("main_menu");
  // const [collectionMenu, setCollectionMenu] = useState("main_menu");
  // const [samplingInterval, setSamplingInterval] = useState("7");
  // const [showKeywordRecommendations, setShowKeywordRecommendations] =
  //   useState(true);
  // const [showCollectionRecommendations, setShowCollectionRecommendations] =
  //   useState(true);

  const menuOptions = [{ label: "Main menu", value: "main_menu" }];

  const intervalOptions = [
    { label: "Within 7 days", value: "7" },
    { label: "Within 14 days", value: "14" },
    { label: "Within 30 days", value: "30" },
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
      backgroundColor: (checked) => (checked ? "#008060" : "#BABFC4"),
      borderRadius: "12px",
      transition: "background-color 0.2s ease",
    },
    knob: {
      position: "absolute",
      content: '""',
      height: "20px",
      width: "20px",
      left: (checked) => (checked ? "22px" : "2px"),
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

  const [hotKeywordRecommendations, setHotKeywordRecommendations] = useState('aiKeyRecommendations');
  const [showCustomKeywordsField, setShowCustomKeywordsField] = useState(false);

  const handleHotKeywordRecommendationsChange = useCallback(
    (newValue) => setHotKeywordRecommendations(newValue),
    [],
  );

  return (
    <Layout>
      <Layout.AnnotatedSection
        id={"SearchRecommendation"}
        title="Search recommendations"
        description={`Search recommendations are based on your customers' search history.`}
      >
        <BlockStack gap="400">
          {/* Search recommendations toggle */}
          <Card padding="400">
            <InlineStack align="space-between">
              <Text variant="headingMd">Enable</Text>
              <ToggleSwitch
                checked={searchRecommendations}
                onChange={() =>
                  setSearchRecommendations(!searchRecommendations)
                }
              />
            </InlineStack>
          </Card>


          <Card padding="400">
            <BlockStack gap="200">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Hot Keywords
              </Text>
              <RadioButton
                label="AI recommendation"
                helpText="Recommendations are generated via AI to your customers."
                checked={hotKeywordRecommendations === 'aiKeyRecommendations'}
                id="aiKeyRecommendations"
                name="aiKeyRecommendations"
                onChange={() => {
                  handleHotKeywordRecommendationsChange('aiKeyRecommendations');
                  setShowCustomKeywordsField(false);
                }}
              />
              <RadioButton
                label="Manual recommendation"
                helpText="Recommendations are generated manually."
                checked={hotKeywordRecommendations === 'manualKeyRecommendations'}
                id="manualKeyRecommendations"
                name="manualKeyRecommendations"
                onChange={() => {
                  handleHotKeywordRecommendationsChange('manualKeyRecommendations');
                  setShowCustomKeywordsField(true);
                }}
              />
              {showCustomKeywordsField && (
                <TextField
                  label="Custom hot keywords"
                  value={customHotKeywords}
                  onChange={setCustomHotKeywords}
                  autoComplete="off"
                  placeholder="jacket, t-shirt, shoes, etc"
                />
              )}
            </BlockStack>
          </Card>

          {/* Custom hot keywords */}
          {/* <Card padding="400">
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <Checkbox
                  label={
                    <Text variant="bodyMd" fontWeight="semibold">
                      Custom hot keywords
                    </Text>
                  }
                  checked={customHotKeywords}
                  onChange={() => setCustomHotKeywords(!customHotKeywords)}
                />
              </InlineStack>

              {customHotKeywords && (
                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd" color="subdued">
                    You can customize recommended content in the "Content Menu"
                    in the backend and select the menu to apply.
                  </Text>
                  <Select
                    options={menuOptions}
                    value={keywordMenu}
                    onChange={setKeywordMenu}
                    label=""
                  />
                </BlockStack>
              )}

              <InlineStack align="space-between">
                <Checkbox
                  label={
                    <Text variant="bodyMd" fontWeight="semibold">
                      Custom hot product collections
                    </Text>
                  }
                  checked={customHotCollections}
                  onChange={() =>
                    setCustomHotCollections(!customHotCollections)
                  }
                />
              </InlineStack>

              {customHotCollections && (
                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd" color="subdued">
                    You can customize recommended content in the "Content Menu"
                    in the backend and select the menu to apply.
                  </Text>
                  <Select
                    options={menuOptions}
                    value={collectionMenu}
                    onChange={setCollectionMenu}
                    label=""
                  />
                </BlockStack>
              )}
            </BlockStack>
          </Card> */}

          {/* Sampling interval */}
          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Sampling interval
              </Text>
              <Text as="p" variant="bodyMd" color="subdued">
                The time range for recording user search keywords. And showing recent search
              </Text>
              <Select
                options={intervalOptions}
                value={samplingInterval}
                onChange={setSamplingInterval}
                label=""
              />
            </BlockStack>
          </Card>

          {/* Search items */}
          {/* <Card padding="400">
            <BlockStack gap="400">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Search items
              </Text>

              <InlineStack align="space-between">
                <Text variant="bodyMd">
                  Show "Keyword" recommendations and related searches
                </Text>
                <ToggleSwitch
                  checked={showKeywordRecommendations}
                  onChange={() =>
                    setShowKeywordRecommendations(!showKeywordRecommendations)
                  }
                />
              </InlineStack>

              <InlineStack align="space-between">
                <Text variant="bodyMd">
                  Show "Product Collection" recommendations and related searches
                </Text>
                <ToggleSwitch
                  checked={showCollectionRecommendations}
                  onChange={() =>
                    setShowCollectionRecommendations(
                      !showCollectionRecommendations,
                    )
                  }
                />
              </InlineStack>
            </BlockStack>
          </Card> */}
        </BlockStack>
      </Layout.AnnotatedSection>
    </Layout>
  );
}
