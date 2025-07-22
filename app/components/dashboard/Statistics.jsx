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
    { label: "Last month", value: "lastMonth" },
    { label: "Last week", value: "lastWeek" },
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

  function convertData(input) {
    return input.map(item => {
      return {
        date: item.date,
        value: item.recentSearch + item.popularQuery
      };
    });
  }

  function convertVisualData(input) {
    return input.map(item => {
      return {
        date: item.date,
        value: item.visualSearch,
      };
    });
  }

  const convertedData = convertData(countSearchKeywordData);
  const convertedVisualData = convertVisualData(countVisualSearchData);
  // console.log("convertedData", convertedData);
  // console.log("convertedVisualData", convertedVisualData);

  // Sample data - replace with actual data from your API
  const data = [
    { date: "04-14", value: 0 },
    { date: "04-18", value: 1 },
    { date: "04-22", value: 0 },
    { date: "04-26", value: 0 },
    { date: "04-30", value: 0 },
    { date: "05-04", value: 0 },
    { date: "05-08", value: 0 },
    { date: "05-12", value: 0 },
  ];

  return (
    <Grid>
      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
        <Card padding="400">
          <Text variant="headingMd" fontWeight="bold" as="h3">
            Search Keyword Clicks
          </Text>
          <Text variant="headingXl" as="p">
            0
          </Text>
          <div style={{ height: "250px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convertedData}>
                <CartesianGrid stroke="#E4E5E7" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis
                  domain={Array.from({ length: Math.ceil(Math.max(...convertedData.map(item => item.value)) + 1) }, (_, i) => i)}
                  axisLine={false}
                  tickLine={false}
                  // ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                  ticks={Array.from({ length: Math.ceil(Math.max(...convertedData.map(item => item.value)) + 1) }, (_, i) => i)}
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
        </Card>
      </Grid.Cell>

      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
        <Card padding="400">
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Text variant="headingMd" fontWeight="bold" as="h3">
              Image Searches
            </Text>
            <Tooltip content="Number of image searches performed by customers">
              <span>
                <Icon source={InfoIcon} color="base" />
              </span>
            </Tooltip>
          </div>
          <Text variant="headingXl" as="p">
            0
          </Text>
          <div style={{ height: "250px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convertedVisualData}>
                <CartesianGrid stroke="#E4E5E7" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis
                  domain={Array.from({ length: Math.ceil(Math.max(...convertedVisualData.map(item => item.value)) + 4) }, (_, i) => i)}
                  axisLine={false}
                  tickLine={false}
                  // ticks={[0, 1, 2, 3, 4]}
                  ticks={Array.from({ length: Math.ceil(Math.max(...convertedVisualData.map(item => item.value)) + 1) }, (_, i) => i)}
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