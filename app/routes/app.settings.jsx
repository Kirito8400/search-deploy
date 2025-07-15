import React, { useState } from "react";
import { Page, BlockStack, Divider } from "@shopify/polaris";
import SearchRecommendationsSettings from "../components/settings/SearchRecommendation";
import AllSettings from "../components/settings/AllSettings";
import ProductRecommendation from "../components/settings/ProductRecomendation";
import ProductImageSearch from "../components/settings/ProductImageSearch";

export default function MainSettings() {

  // allSettings states
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [RecommendedImageSearchPerRow, setRecommendedImageSearchPerRow] = useState(6);
  const [RecommendedImageAspectRatio, setRecommendedImageAspectRatio] = useState('portrait');
  const [RecommendedImageBorderRadius, setRecommendedImageBorderRadius] = useState(4);

  // productImageSearch states
  const [productImageSearch, setProductImageSearch] = useState(true);
  const [dragImageFeature, setDragImageFeature] = useState(true);
  const [useStandalonePage, setUseStandalonePage] = useState(false);
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [showImageSearchButton, setShowImageSearchButton] = useState(true);
  const [showAddToCartButton, setShowAddToCartButton] = useState(true);
  const [displayCollectionInfo, setDisplayCollectionInfo] = useState(false);

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
      productImageSearch: productImageSearch,
      dragImageFeature: dragImageFeature,
      useStandalonePage: useStandalonePage,
      openInNewTab: openInNewTab,
      showImageSearchButton: showImageSearchButton,
      showAddToCartButton: showAddToCartButton,
      displayCollectionInfo: displayCollectionInfo,
    },
    SearchRecommendationsSettings: {
      searchRecommendations: searchRecommendations,
      customHotKeywords: customHotKeywords,
      showRecentSearches: showRecentSearches,
      recentSearchInterval: samplingInterval,
    }
  }

  console.log("settings", settings)

  return (
    <Page title="Settings">
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
        />
        <Divider borderColor="border" borderWidth="050" />
        <ProductImageSearch
          productImageSearch={productImageSearch}
          setProductImageSearch={setProductImageSearch}
          dragImageFeature={dragImageFeature}
          setDragImageFeature={setDragImageFeature}
          useStandalonePage={useStandalonePage}
          setUseStandalonePage={setUseStandalonePage}
          openInNewTab={openInNewTab}
          setOpenInNewTab={setOpenInNewTab}
          showImageSearchButton={showImageSearchButton}
          setShowImageSearchButton={setShowImageSearchButton}
          showAddToCartButton={showAddToCartButton}
          setShowAddToCartButton={setShowAddToCartButton}
          displayCollectionInfo={displayCollectionInfo}
          setDisplayCollectionInfo={setDisplayCollectionInfo}
        />
      </BlockStack>
      <br />
      <br />
    </Page>
  );
}
