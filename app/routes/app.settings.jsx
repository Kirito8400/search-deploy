import React, { useState } from "react";
import { Page, BlockStack, Divider } from "@shopify/polaris";
import SearchRecommendationsSettings from "../components/settings/SearchRecommendation";
import AllSettings from "../components/settings/AllSettings";
import ProductRecommendation from "../components/settings/ProductRecomendation";
import ProductImageSearch from "../components/settings/ProductImageSearch";

export default function MainSettings() {

  // allSettings states
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [selectorStyle, setSelectorStyle] = useState("button");

  // productImageSearch states
  const [productImageSearch, setProductImageSearch] = useState(true);
  const [dragImageFeature, setDragImageFeature] = useState(true);
  const [useStandalonePage, setUseStandalonePage] = useState(false);
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [showImageSearchButton, setShowImageSearchButton] = useState(true);
  const [showAddToCartButton, setShowAddToCartButton] = useState(true);
  const [displayCollectionInfo, setDisplayCollectionInfo] = useState(false);

  // searchRecommendations states
  const [searchRecommendations, setSearchRecommendations] = useState(true);
  const [customHotKeywords, setCustomHotKeywords] = useState(false);
  const [customHotCollections, setCustomHotCollections] = useState(false);
  const [keywordMenu, setKeywordMenu] = useState("main_menu");
  const [collectionMenu, setCollectionMenu] = useState("main_menu");
  const [samplingInterval, setSamplingInterval] = useState("7");
  const [showKeywordRecommendations, setShowKeywordRecommendations] =
    useState(true);
  const [showCollectionRecommendations, setShowCollectionRecommendations] =
    useState(true);

  // productRecommendation states
  const [productRecommendationsR, setProductRecommendationsR] = useState(true);
  const [showImageSearchButtonR, setShowImageSearchButtonR] = useState(true);
  const [showAddToCartButtonR, setShowAddToCartButtonR] = useState(true);
  const [displayCollectionInfoR, setDisplayCollectionInfoR] = useState(false);
  const [cacheTimeR, setCacheTimeR] = useState("1");


  // settings onject
  const settings = {
    AllSettings: {
      hideOutOfStock: hideOutOfStock,
      // selectorStyle: selectorStyle,
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
    ProductRecommendation: {
      productRecommendations: productRecommendationsR,
      showImageSearchButton: showImageSearchButtonR,
      showAddToCartButton: showAddToCartButtonR,
      displayCollectionInfo: displayCollectionInfoR,
      cacheTime: cacheTimeR
    },
    SearchRecommendationsSettings: {
      searchRecommendations: searchRecommendations,
      customHotKeywords: customHotKeywords,
      customHotCollections: customHotCollections,
      keywordMenu: keywordMenu,
      collectionMenu: collectionMenu,
      samplingInterval: samplingInterval,
      showKeywordRecommendations: showKeywordRecommendations,
      showCollectionRecommendations: showCollectionRecommendations,
    }
  }

  console.log("settings", settings)

  return (
    <Page title="Settings">
      <BlockStack gap="400">
        <AllSettings
          hideOutOfStock={hideOutOfStock}
          setHideOutOfStock={setHideOutOfStock}
          selectorStyle={selectorStyle}
          setSelectorStyle={setSelectorStyle}
        />
        <Divider borderColor="border" borderWidth="050" />
        <SearchRecommendationsSettings
          searchRecommendations={searchRecommendations}
          setSearchRecommendations={setSearchRecommendations}
          customHotKeywords={customHotKeywords}
          setCustomHotKeywords={setCustomHotKeywords}
          customHotCollections={customHotCollections}
          setCustomHotCollections={setCustomHotCollections}
          keywordMenu={keywordMenu}
          setKeywordMenu={setKeywordMenu}
          collectionMenu={collectionMenu}
          setCollectionMenu={setCollectionMenu}
          samplingInterval={samplingInterval}
          setSamplingInterval={setSamplingInterval}
          showKeywordRecommendations={showKeywordRecommendations}
          setShowKeywordRecommendations={setShowKeywordRecommendations}
          showCollectionRecommendations={showCollectionRecommendations}
          setShowCollectionRecommendations={setShowCollectionRecommendations}
        />
        <Divider borderColor="border" borderWidth="050" />
        {/* <ProductRecommendation
          productRecommendations={productRecommendationsR}
          setProductRecommendations={setProductRecommendationsR}
          showImageSearchButton={showImageSearchButtonR}
          setShowImageSearchButton={setShowImageSearchButtonR}
          showAddToCartButton={showAddToCartButtonR}
          setShowAddToCartButton={setShowAddToCartButtonR}
          displayCollectionInfo={displayCollectionInfoR}
          setDisplayCollectionInfo={setDisplayCollectionInfoR}
          cacheTime={cacheTimeR}
          setCacheTime={setCacheTimeR}
        /> */}
        {/* <Divider borderColor="border" borderWidth="050" /> */}
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
