import {
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Select,
  RadioButton,
  TextField,
} from "@shopify/polaris";
import { useCallback } from "react";

// Search recommendations settings section
export default function SearchRecommendationsSettings({
  hotKeywords,
  setHotKeywords,
  customHotKeywords,
  setCustomHotKeywords,
  showRecentSearches,
  setShowRecentSearches,
  samplingInterval,
  setSamplingInterval,
  hotKeywordRecommendations,
  setHotKeywordRecommendations,
  showCustomKeywordsField,
  setShowCustomKeywordsField,
  popularImageSearch,
  setPopularImageSearch,
}) {

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
          <Card padding="400">
            <BlockStack gap="200">
              <Text as="h3" variant="headingMd" fontWeight="semibold">
                Hot Keywords
              </Text>
              <InlineStack align="space-between">
                <Text variant="headingMd">Enable</Text>
                <ToggleSwitch
                  checked={hotKeywords}
                  onChange={() =>
                    setHotKeywords(!hotKeywords)
                  }
                />
              </InlineStack>
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
                  onChange={(value) => setCustomHotKeywords(value)}
                  autoComplete="off"
                  placeholder="jacket, t-shirt, shoes, etc"
                />
              )}
            </BlockStack>
          </Card>

          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd" fontWeight="semibold">
                Recent Searches
              </Text>
              <InlineStack align="space-between">
                <Text variant="bodyMd" fontWeight="semibold">
                  Show recent searches
                </Text>
                <ToggleSwitch
                  checked={showRecentSearches}
                  onChange={() => {
                    setShowRecentSearches(!showRecentSearches);
                  }}
                />
              </InlineStack>
            </BlockStack>
          </Card>

          {/* Sampling interval */}
          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Recent Search interval
              </Text>
              <Text as="p" variant="bodyMd" color="subdued">
                The time range for recording user's search keywords. And showing recent search
              </Text>
              <Select
                options={intervalOptions}
                value={samplingInterval}
                onChange={setSamplingInterval}
                label=""
              />
            </BlockStack>
          </Card>

          {/* Popualar Image Search */}
          <Card padding="400">
            <BlockStack gap="400">
              <Text as="h3" variant="bodyLg" fontWeight="semibold">
                Popular Image Search
              </Text>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text variant="bodyMd">
                    Show popular image search
                  </Text>
                  <ToggleSwitch
                    checked={popularImageSearch}
                    onChange={() =>
                      setPopularImageSearch(!popularImageSearch)
                    }
                  />
                </InlineStack>
              </BlockStack>
            </BlockStack>
          </Card>
        </BlockStack>
      </Layout.AnnotatedSection>
    </Layout>
  );
}