import { useState } from "react";
import { Page, BlockStack, Divider, Toast, Banner, Frame } from "@shopify/polaris";
import SearchRecommendationsSettings from "../components/settings/SearchRecommendation";
import AllSettings from "../components/settings/AllSettings";
import ProductImageSearch from "../components/settings/ProductImageSearch";
import { authenticate } from "../shopify.server"
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useCallback } from "react";
import { useEffect } from "react";


export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query{
      shop{
        id
      }
    }
  `)

  const shopData = await response.json();
  const shopId = shopData.data.shop.id;

  return { shopId };
}

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();
  const shopId = formData.get('shopId');
  const settings = formData.get('settings');

  const mutation = (`
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          type
          value
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `)

  const metafields = [
    {
      ownerId: shopId,
      namespace: "vs_settings_namespace",
      key: "vs_settings_key",
      type: "json",
      value: settings,
    },
  ];

  const response = await admin.graphql(mutation, { variables: { metafields } });

  return json({ data: response.data, message: "Settings saved successfully!", success: true });

}

export default function MainSettings() {
  const { shopId } = useLoaderData();

  const fetcher = useFetcher(); // Initialize fetcher
  const isSubmitting = fetcher.state === "submitting"; // Check if fetcher is currently submitting

  const [toastActive, setToastActive] = useState(false);

  // allSettings states
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [RecommendedImageSearchPerRow, setRecommendedImageSearchPerRow] = useState(6);
  const [RecommendedImageAspectRatio, setRecommendedImageAspectRatio] = useState('portrait');
  const [RecommendedImageBorderRadius, setRecommendedImageBorderRadius] = useState(4);


  // productImageSearch states
  const [productImageSearch, setProductImageSearch] = useState(true);

  // searchRecommendations states
  const [hotKeywords, setHotKeywords] = useState(false);
  const [searchRecommendations, setSearchRecommendations] = useState(true);
  const [customHotKeywords, setCustomHotKeywords] = useState('');
  const [showRecentSearches, setShowRecentSearches] = useState(true);

  const [hotKeywordRecommendations, setHotKeywordRecommendations] = useState('aiKeyRecommendations');
  const [showCustomKeywordsField, setShowCustomKeywordsField] = useState(false);
  const [popularImageSearch, setPopularImageSearch] = useState(false);

  const [samplingInterval, setSamplingInterval] = useState("7");
  useState(true);

  // productRecommendation states


  // settings onject
  const settings = {
    AllSettings: {
      hideOutOfStock: hideOutOfStock,
      RecommendedImageSearchPerRow: RecommendedImageSearchPerRow,
      RecommendedImageAspectRatio: RecommendedImageAspectRatio,
      RecommendedImageBorderRadius: RecommendedImageBorderRadius,
    },
    ProductImageSearch: {
      popularImageSearch: productImageSearch,
    },
    SearchRecommendationsSettings: {
      searchRecommendations: searchRecommendations,
      customHotKeywords: customHotKeywords,
      showRecentSearches: showRecentSearches,
      recentSearchInterval: samplingInterval,
      hotKeywordRecommendations: hotKeywordRecommendations,
      showCustomKeywordsField: showCustomKeywordsField,
      popularImageSearch: popularImageSearch,
    }
  }

  console.log("settings", settings)

  // Toast toggle logic

  const toggleToastActive = useCallback(() => setToastActive((active) => !active), []);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setToastActive(true);
    }
  }, [fetcher.state, fetcher.data]);

  const toastMarkup = toastActive ? (
    <Toast content="Settings saved successfully" onDismiss={toggleToastActive} />
  ) : null;

  return (
    <>
      <Frame>
        {/* <Banner status="success" title="Settings saved successfully!" /> */}
        <Page title="Settings" primaryAction={{
          content: 'Save',
          onAction: () => fetcher.submit({ shopId, settings: JSON.stringify(settings) }, { method: "post", action: "/app/settings" }), // Use fetcher to submit settings
          loading: isSubmitting,
        }}>
          <BlockStack gap="400">
            <AllSettings
              hideOutOfStock={hideOutOfStock}
              setHideOutOfStock={setHideOutOfStock}
              RecommendedImageSearchPerRow={RecommendedImageSearchPerRow}
              setRecommendedImageSearchPerRow={setRecommendedImageSearchPerRow}
              RecommendedImageAspectRatio={RecommendedImageAspectRatio}
              setRecommendedImageAspectRatio={setRecommendedImageAspectRatio}
              RecommendedImageBorderRadius={RecommendedImageBorderRadius}
              setRecommendedImageBorderRadius={setRecommendedImageBorderRadius}
            />
            <Divider borderColor="border" borderWidth="050" />
            <SearchRecommendationsSettings
              hotKeywords={hotKeywords}
              setHotKeywords={setHotKeywords}
              searchRecommendations={searchRecommendations}
              setSearchRecommendations={setSearchRecommendations}
              customHotKeywords={customHotKeywords}
              setCustomHotKeywords={setCustomHotKeywords}
              showRecentSearches={showRecentSearches}
              setShowRecentSearches={setShowRecentSearches}
              samplingInterval={samplingInterval}
              setSamplingInterval={setSamplingInterval}
              hotKeywordRecommendations={hotKeywordRecommendations}
              setHotKeywordRecommendations={setHotKeywordRecommendations}
              showCustomKeywordsField={showCustomKeywordsField}
              setShowCustomKeywordsField={setShowCustomKeywordsField}
              popularImageSearch={popularImageSearch}
              setPopularImageSearch={setPopularImageSearch}
            />
            <Divider borderColor="border" borderWidth="050" />
            <ProductImageSearch
              productImageSearch={productImageSearch}
              setProductImageSearch={setProductImageSearch}
            />
          </BlockStack>
          <br />
          <br />

          {/* Toast for success notification */}
          {toastMarkup}
        </Page>
      </Frame>
    </>
  );
}