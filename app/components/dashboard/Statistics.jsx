import React from "react";
import {
  Card,
  Text,
  Grid,
  Icon,
  Tooltip,
  BlockStack,
  InlineStack,
  Select,
  Badge,
  Button,
} from "@shopify/polaris";
import { ArrowDownIcon, InfoIcon } from "@shopify/polaris-icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Helper function to filter data by date range
const filterDataByDateRange = (data, range) => {
  const now = new Date();
  const cutoffDate = new Date(now);

  switch (range) {
    case "lastWeek":
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case "lastMonth":
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case "last3Months":
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    default:
      cutoffDate.setMonth(now.getMonth() - 1);
  }

  return data.filter((item) => {
    const [month, day] = item.date.split("-").map(Number);
    // Create a date object (using current year since your dates don't include year)
    const itemDate = new Date(now.getFullYear(), month - 1, day);
    return itemDate >= cutoffDate;
  });
};

// Helper function to convert data to CSV
const convertToCSV = (keywordData, visualData) => {
  const headers = "Date,Keyword Clicks,Image Searches,Total Searches\n";

  // Create a map to combine data by date
  const dataMap = new Map();

  // Process keyword data
  keywordData.forEach((item) => {
    const clicks = item.recentSearch + item.popularQuery;
    dataMap.set(item.date, { keywordClicks: clicks, visualSearches: 0 });
  });

  // Process visual search data
  visualData.forEach((item) => {
    const existing = dataMap.get(item.date) || { keywordClicks: 0 };
    dataMap.set(item.date, {
      ...existing,
      visualSearches: item.visualSearch,
    });
  });

  // Convert map to CSV rows
  let csvRows = headers;
  Array.from(dataMap.entries()).forEach(([date, data]) => {
    const total = data.keywordClicks + data.visualSearches;
    csvRows += `${date},${data.keywordClicks},${data.visualSearches},${total}\n`;
  });

  return csvRows;
};

// Helper function to download CSV
const downloadCSV = (csvData, filename) => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function Statistics({
  countSearchKeywordData,
  countVisualSearchData,
  billingStatus,
}) {
  const [selectedRange, setSelectedRange] = React.useState("lastMonth");

  const handleSelectChange = React.useCallback(
    (value) => setSelectedRange(value),
    [],
  );

  const handleDownload = React.useCallback(() => {
    const filteredKeywordData = filterDataByDateRange(
      countSearchKeywordData,
      selectedRange,
    );
    const filteredVisualData = filterDataByDateRange(
      countVisualSearchData,
      selectedRange,
    );
    const csvData = convertToCSV(filteredKeywordData, filteredVisualData);
    const filename = `search-statistics-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(csvData, filename);
  }, [selectedRange, countSearchKeywordData, countVisualSearchData]);

  const options = [
    { label: "Last week", value: "lastWeek" },
    { label: "Last month", value: "lastMonth" },
    { label: "Last 3 months", value: "last3Months" },
  ];

  // Filter data based on selected time range
  const filteredKeywordData = filterDataByDateRange(
    countSearchKeywordData,
    selectedRange,
  );
  const filteredVisualData = filterDataByDateRange(
    countVisualSearchData,
    selectedRange,
  );

  // Calculate date range display text
  const getDateRangeText = (range) => {
    const now = new Date();
    const startDate = new Date(now);

    switch (range) {
      case "lastWeek":
        startDate.setDate(now.getDate() - 7);
        break;
      case "lastMonth":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "last3Months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return `${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()} ~ ${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
  };

  return (
    <BlockStack gap="400">
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="200" blockAlign="center">
          <Text variant="headingLg" fontWeight="bold" as="h2">
            Statistics
          </Text>
          <Text variant="bodyMd" color="subdued">
            {getDateRangeText(selectedRange)}
          </Text>
        </InlineStack>

        <InlineStack gap="200">
          <Select
            options={options}
            onChange={handleSelectChange}
            value={selectedRange}
            labelHidden
          />
          <Button icon={ArrowDownIcon} onClick={handleDownload}>
            Download statistics
          </Button>
          {!billingStatus?.isProMonthly ||
            (!billingStatus?.isProAnnual && <Badge size="slim">Upgrade</Badge>)}
        </InlineStack>
      </InlineStack>

      <ProductImageStatistics
        countSearchKeywordData={filteredKeywordData}
        countVisualSearchData={filteredVisualData}
      />
      <SearchPerformance
        countSearchKeywordData={filteredKeywordData}
        countVisualSearchData={filteredVisualData}
      />
    </BlockStack>
  );
}

export function ProductImageStatistics({
  countSearchKeywordData,
  countVisualSearchData,
}) {
  // Data conversion functions
  const convertData = (input) =>
    input.map((item) => ({
      date: item.date,
      value: item.recentSearch + item.popularQuery,
    }));

  const convertVisualData = (input) =>
    input.map((item) => ({
      date: item.date,
      value: item.visualSearch,
    }));

  // Process data
  const keywordData = convertData(countSearchKeywordData);
  const visualData = convertVisualData(countVisualSearchData);

  // Calculate totals for display
  const totalKeywordClicks = keywordData.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const totalVisualSearches = visualData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  // Chart configuration
  const chartProps = {
    width: "100%",
    height: 250,
    margin: { top: 5, right: 5, left: 5, bottom: 5 },
    lineProps: {
      type: "monotone",
      stroke: "#5C6AC4",
      dot: { fill: "#5C6AC4" },
      activeDot: { r: 6 },
    },
    axisProps: {
      axisLine: false,
      tickLine: false,
    },
  };

  const getYAxisDomain = (data) => [
    0,
    Math.max(...data.map((item) => item.value)) + 1,
  ];

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
                <XAxis dataKey="date" {...chartProps.axisProps} />
                <YAxis
                  domain={getYAxisDomain(keywordData)}
                  {...chartProps.axisProps}
                />
                <Line dataKey="value" {...chartProps.lineProps} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Grid.Cell>

      {/* Image Searches Card */}
      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
        <Card padding="400">
          <InlineStack align="start" gap="100">
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
                <XAxis dataKey="date" {...chartProps.axisProps} />
                <YAxis
                  domain={getYAxisDomain(visualData)}
                  {...chartProps.axisProps}
                />
                <Line dataKey="value" {...chartProps.lineProps} />
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
    keywordData.forEach((item) => {
      const total = item.recentSearch + item.popularQuery;
      performanceMap.set(
        item.date,
        (performanceMap.get(item.date) || 0) + total,
      );
    });

    // Process visual search data
    visualData.forEach((item) => {
      performanceMap.set(
        item.date,
        (performanceMap.get(item.date) || 0) + item.visualSearch,
      );
    });

    // Convert map to array of objects
    return Array.from(performanceMap.entries()).map(([date, value]) => ({
      date,
      value,
    }));
  }

  const searchData = convertSearchPerformanceData(
    countSearchKeywordData,
    countVisualSearchData,
  );

  // Calculate totals for the summary cards
  const totalKeywordClicks = countSearchKeywordData.reduce(
    (sum, item) => sum + item.recentSearch + item.popularQuery,
    0,
  );

  const totalVisualClicks = countVisualSearchData.reduce(
    (sum, item) => sum + item.visualSearch,
    0,
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
                background: "#fff",
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
                domain={[0, "dataMax + 1"]}
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
