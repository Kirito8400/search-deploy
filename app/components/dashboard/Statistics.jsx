import React from "react";
import { Card, Text, Grid, Icon, Tooltip, BlockStack, InlineStack, Select, Badge, Button } from "@shopify/polaris";
import { ArrowDownIcon, InfoIcon } from "@shopify/polaris-icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export function Statistics({ countSearchKeywordData, countVisualSearchData }) {
  console.log("countSearchKeywordData", countSearchKeywordData);
  console.log("countVisualSearchData", countVisualSearchData);

  const [selected, setSelected] = React.useState("lastMonth");

  const handleSelectChange = React.useCallback(
    (value) => setSelected(value),
    [],
  );

  const options = [
    { label: "Last week", value: "lastWeek" },
    { label: "Last month", value: "lastMonth" },
    { label: "Last 3 months", value: "last3Months" },
  ];

  return (
    <BlockStack gap="400">
      {/* Top navigation */}
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="200" blockAlign="center">
          <Text variant="headingLg" fontWeight="bold" as="h2">
            Statistics
          </Text>
          <Text variant="bodyMd" color="subdued">
            2025/4/12 ~ 2025/5/12
          </Text>
        </InlineStack>

        <InlineStack gap="200">
          <Select
            options={options}
            onChange={handleSelectChange}
            value={selected}
            labelHidden
          />
          <Button icon={ArrowDownIcon}>Download statistics</Button>
          <Badge>Upgrade</Badge>
        </InlineStack>
      </InlineStack>

      <ProductImageStatistics countSearchKeywordData={countSearchKeywordData} countVisualSearchData={countVisualSearchData} />
      <SearchPerformance countSearchKeywordData={countSearchKeywordData} countVisualSearchData={countVisualSearchData} />
    </BlockStack>
  );
}

export function ProductImageStatistics({ countSearchKeywordData, countVisualSearchData }) {
  // Data conversion functions
  const convertData = (input) => input.map(item => ({
    date: item.date,
    value: item.recentSearch + item.popularQuery
  }));

  const convertVisualData = (input) => input.map(item => ({
    date: item.date,
    value: item.visualSearch
  }));

  // Process data
  const keywordData = convertData(countSearchKeywordData);
  const visualData = convertVisualData(countVisualSearchData);
  
  // Calculate totals for display
  const totalKeywordClicks = keywordData.reduce((sum, item) => sum + item.value, 0);
  const totalVisualSearches = visualData.reduce((sum, item) => sum + item.value, 0);

  // Chart configuration
  const chartProps = {
    width: "100%",
    height: 250,
    margin: { top: 5, right: 5, left: 5, bottom: 5 },
    lineProps: {
      type: "monotone",
      stroke: "#5C6AC4",
      dot: { fill: "#5C6AC4" },
      activeDot: { r: 6 }
    },
    axisProps: {
      axisLine: false,
      tickLine: false
    }
  };

  const getYAxisDomain = (data) => 
    [0, Math.max(...data.map(item => item.value)) + 1];

  return (
    <Grid>
      {/* Keyword Clicks Card */}
      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
        <Card padding="400">
          <Text variant="headingMd" fontWeight="bold" as="h3">
            Search Keyword Clicks
          </Text>
          <Text variant="headingXl" as="p">
            {totalKeywordClicks}
          </Text>
          
          <div style={{ height: chartProps.height, width: chartProps.width }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={keywordData} margin={chartProps.margin}>
                <CartesianGrid stroke="#E4E5E7" />
                <XAxis 
                  dataKey="date" 
                  {...chartProps.axisProps} 
                />
                <YAxis
                  domain={getYAxisDomain(keywordData)}
                  {...chartProps.axisProps}
                />
                <Line
                  dataKey="value"
                  {...chartProps.lineProps}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Grid.Cell>

      {/* Image Searches Card */}
      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
        <Card padding="400">
          <InlineStack align="center" gap="100">
            <Text variant="headingMd" fontWeight="bold" as="h3">
              Image Searches
            </Text>
            <Tooltip content="Number of image searches performed by customers">
              <Icon source={InfoIcon} color="base" />
            </Tooltip>
          </InlineStack>
          
          <Text variant="headingXl" as="p">
            {totalVisualSearches}
          </Text>
          
          <div style={{ height: chartProps.height, width: chartProps.width }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visualData} margin={chartProps.margin}>
                <CartesianGrid stroke="#E4E5E7" />
                <XAxis 
                  dataKey="date" 
                  {...chartProps.axisProps} 
                />
                <YAxis
                  domain={getYAxisDomain(visualData)}
                  {...chartProps.axisProps}
                />
                <Line
                  dataKey="value"
                  {...chartProps.lineProps}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Grid.Cell>
    </Grid>
  );
}

function SearchPerformance({ countSearchKeywordData, countVisualSearchData }) {
  // Combine the data from both props to get total search performance
  function convertSearchPerformanceData(keywordData, visualData) {
    // Create a map to combine values by date
    const performanceMap = new Map();

    // Process keyword data
    keywordData.forEach(item => {
      const total = item.recentSearch + item.popularQuery;
      performanceMap.set(item.date, (performanceMap.get(item.date) || 0) + total);
    });

    // Process visual search data
    visualData.forEach(item => {
      performanceMap.set(item.date, (performanceMap.get(item.date) || 0) + item.visualSearch);
    });

    // Convert map to array of objects
    return Array.from(performanceMap.entries()).map(([date, value]) => ({
      date,
      value
    }));
  }

  const searchData = convertSearchPerformanceData(countSearchKeywordData, countVisualSearchData);

  // Calculate totals for the summary cards
  const totalKeywordClicks = countSearchKeywordData.reduce(
    (sum, item) => sum + item.recentSearch + item.popularQuery, 0
  );

  const totalVisualClicks = countVisualSearchData.reduce(
    (sum, item) => sum + item.visualSearch, 0
  );

  // For demonstration - you might want to get actual product click data from props
  const totalProductClicks = 0;

  return (
    <Card padding="400">
      <BlockStack gap="400">
        <Text variant="headingMd" fontWeight="bold" as="h3">
          Total Search Performance
        </Text>

        <Grid>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 6, xl: 6 }}>
            <div
              style={{
                background: "#eee",
                border: "1px solid #999",
                borderRadius: "10px",
                padding: "8px 12px",
              }}
            >
              <BlockStack gap="100">
                <Text variant="bodyMd" fontWeight="semibold">
                  Keyword clicks
                </Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <Text variant="headingLg">{totalKeywordClicks}</Text>
                  <Text variant="bodyMd" color="subdued">
                    Clicks
                  </Text>
                </div>
              </BlockStack>
            </div>
          </Grid.Cell>

          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 6, xl: 6 }}>
            <div
              style={{
                border: "1px solid #999",
                borderRadius: "10px",
                padding: "8px 12px",
              }}
            >
              <BlockStack gap="100">
                <Text variant="bodyMd" fontWeight="semibold">
                  Image searches
                </Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <Text variant="headingLg">{totalVisualClicks}</Text>
                  <Text variant="bodyMd" color="subdued">
                    Searches
                  </Text>
                </div>
              </BlockStack>
            </div>
          </Grid.Cell>

          {/* <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <div
              style={{
                border: "1px solid #999",
                borderRadius: "10px",
                padding: "8px 12px",
              }}
            >
              <BlockStack gap="100">
                <Text variant="bodyMd" fontWeight="semibold">
                  Product clicks
                </Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <Text variant="headingLg">{totalProductClicks}</Text>
                  <Text variant="bodyMd" color="subdued">
                    Clicks
                  </Text>
                </div>
              </BlockStack>
            </div>
          </Grid.Cell> */}
        </Grid>

        <div style={{ height: "250px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={searchData}>
              <CartesianGrid stroke="#E4E5E7" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 'dataMax + 1']}
                axisLine={false}
                tickLine={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5C6AC4"
                dot={{ fill: "#5C6AC4" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </BlockStack>
    </Card>
  );
}