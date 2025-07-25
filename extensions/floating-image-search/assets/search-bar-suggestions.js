
document.addEventListener('DOMContentLoaded', async function () {
    // New function to fetch settings
    async function fetchSettings() {
        try {
            const shopUrl = window.location.origin; // Assuming shopUrl is defined globally
            const response = await fetch(`${shopUrl}/apps/api/settings`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const settings = await response.json();
            console.log('Fetched settings:', settings);
            return settings;
        } catch (error) {
            console.error('Error fetching settings:', error);
            return null;
        }
    }

    const settings = fetchSettings();

    // Constants and configuration with metafield settings overrides
    const CONFIG = {
        searchDelay: 300,
        enableDynamicSearch: true,
        showPopularQueries: settings?.settings?.SearchRecommendationsSettings?.searchRecommendations ?? true,
        showPopularProducts: settings?.settings?.ProductImageSearch?.popularImageSearch ?? true,
        maxSearchResults: 6,
        imageAspectRatio: settings?.settings?.AllSettings?.RecommendedImageAspectRatio ?? 'portrait',
        imageBorderRadius: settings?.settings?.AllSettings?.RecommendedImageBorderRadius ?? 4,
        showRecentSearches: settings?.settings?.SearchRecommendationsSettings?.showRecentSearches ?? true,
        recentSearchInterval: settings?.settings?.SearchRecommendationsSettings?.recentSearchInterval ?? '7',
        placeholderImage: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png'
    };

    // Apply image styling based on settings
    document.querySelectorAll('.vs-sg-popular-products-grid img').forEach(img => {
        img.style.aspectRatio = CONFIG.imageAspectRatio;
        img.style.borderRadius = `${CONFIG.imageBorderRadius}px`;
    });

    // DOM Elements
    const suggestionsWrapper = document.querySelector('.vs-sg-search-suggestions-wrapper');
    const searchForms = document.querySelectorAll('header form[action="/search"]');



    if (!suggestionsWrapper || searchForms.length === 0) return;

    // Add CSS for spinner and search results
    addStyles();

    // Initialize search suggestions for each search form
    searchForms.forEach(form => initializeSearchSuggestions(form));

    // Remove the original template element after cloning
    suggestionsWrapper.remove();

    // Add global document click handler
    setupGlobalClickHandler();

    /**
     * Initialize search suggestions for a specific search form
     * @param {HTMLElement} form - The search form element
    */
    function initializeSearchSuggestions(form) {
        // Clone the suggestions wrapper
        const clonedSuggestions = suggestionsWrapper.cloneNode(true);
        form.appendChild(clonedSuggestions);

        // Find search input within this form
        const searchInput = form.querySelector('input[type="search"], [name="q"], .search-input, .search__input');
        if (!searchInput) return;

        // Inside initializeSearchSuggestions()
        displayRecentSearches(searchInput); // 👈 Pass searchInput

        // Get UI elements
        const elements = {
            dynamicSearchResults: clonedSuggestions.querySelector('.vs-sg-dynamic-search-results'),
            dynamicProductsGrid: clonedSuggestions.querySelector('.vs-sg-dynamic-products-grid'),
            popularImages: clonedSuggestions.querySelectorAll('.vs-sg-product-image img'),
            popularQuery: clonedSuggestions.querySelector('.vs-sg-popular-query'),
            popularProducts: clonedSuggestions.querySelector('.vs-sg-popular-search-products'),
            popularProductsGrid: clonedSuggestions.querySelector('.vs-sg-popular-products-grid'),
            popularQueryItems: clonedSuggestions.querySelectorAll('.vs-sg-query-item'),
            recentSearches: clonedSuggestions.querySelectorAll('.vs-sg-query-item.recent-search-item'),

            popularQueryContainer: clonedSuggestions.querySelectorAll('.vs-sg-popular-query'),
        };

        // Set up debounce for search
        let searchTimeout;

        // Add event listeners
        setupSearchInputListener(searchInput, elements, searchTimeout);
        setupFormSubmitListener(form, searchInput, clonedSuggestions);
        setupPopularProductsListener(elements.popularProductsGrid, form, clonedSuggestions);
        setupPopularQueriesListener(elements.popularQueryItems, searchInput, elements, searchTimeout);

        // Add click handlers to your elements:
        elements?.popularQueryItems?.forEach(item => {
            console.log('Adding click handler to popular query:');
            item.addEventListener('click', () => {
                trackSearchClick('popular_query', item.textContent);
            });
        });
        // add click handlers to recent searches:
        elements?.recentSearches?.forEach(item => {
            console.log('Adding click handler to recent search:');
            item.addEventListener('click', () => {
                trackSearchClick('recent_search', item.textContent);
            });
        });

    }

    /**
     * Set up the search input listener for dynamic search
     */
    function setupSearchInputListener(searchInput, elements, searchTimeout) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim();
            clearTimeout(searchTimeout);

            if (query.length > 0) {
                // Hide dwan predictive search(.predictive-search)
                document.querySelectorAll('.predictive-search').forEach(el => el.style.display = 'none');

                // Hide Recent Searches
                document.querySelectorAll('.vs-sg-recent-search-query').forEach(el => el.style.display = 'none');

                // Show search results, hide popular sections
                toggleVisibility(elements, true);

                // Debounce search
                searchTimeout = setTimeout(() => {
                    fetchSearchResults(query, elements.dynamicProductsGrid);
                }, CONFIG.searchDelay);
            } else {
                // Show popular sections, hide search results
                toggleVisibility(elements, false);
            }
        });
    }

    /**
     * Toggle visibility of search UI elements
     * @param {Object} elements - UI elements object
    * @param {boolean} isSearchActive - Whether search is active
    */
    function toggleVisibility(elements, isSearchActive) {
        elements.dynamicSearchResults.style.display = isSearchActive ? 'block' : 'none';
        elements.popularQuery.style.display = isSearchActive ? 'none' : 'block';
        elements.popularProducts.style.display = isSearchActive ? 'none' : 'block';
    }

    /**
     * Set up form submit listener
     */
    function setupFormSubmitListener(form, searchInput, clonedSuggestions) {
        form.addEventListener('submit', function (e) {
            const query = searchInput.value.trim();

            if (query.length > 0) {
                // Save the query to localStorage
                saveSearchQuery(query);

                // Hide suggestions after submit
                clonedSuggestions.style.display = 'none';
            }
        });
    }

    /**
     * Set up popular products click listeners
     */
    function setupPopularProductsListener(popularProductsGrid, form, clonedSuggestions) {
        if (!popularProductsGrid) return;

        const popularImageLinks = popularProductsGrid.querySelectorAll('.vs-sg-product-image');
        popularImageLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const imageUrl = this.querySelector('img').src;
                if (!imageUrl) return;

                handlePopularImageClick(imageUrl, form, clonedSuggestions);
            });
        });
    }

    /**
     * Handle click on popular image
     */
    function handlePopularImageClick(imageUrl, form, clonedSuggestions, imgAlt) {
        trackSearchClick('popular_product', imgAlt, imgAlt);

        const imageSearchModal = form.querySelector('#vs-search-bar-modal');
        const fileInput = imageSearchModal ? imageSearchModal.querySelector('#vs-snp-image-search-file-input') : null;

        if (!imageSearchModal || !fileInput) {
            console.error('Image search modal or file input not found.');
            return;
        }

        // Open the image search modal
        imageSearchModal.classList.add('active');

        // Set up modal close on outside click
        setupModalCloseListener(imageSearchModal);

        // Fetch and process the image
        fetchAndProcessImage(imageUrl, fileInput, clonedSuggestions);
    }

    /**
     * Set up modal close listener
     */
    function setupModalCloseListener(imageSearchModal) {
        imageSearchModal.addEventListener('click', function (event) {
            if (event.target !== imageSearchModal) return;

            imageSearchModal.classList.remove('active');

            // Reset UI elements
            const wrappers = document.querySelectorAll('.vs-snp-image-upload-result-wrapper');
            wrappers.forEach(wrapper => {
                wrapper.classList.remove('after');
            });
        });
    }

    /**
     * Fetch and process image for search
     */
    function fetchAndProcessImage(imageUrl, fileInput, clonedSuggestions) {
        fetch(imageUrl)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch image');
                return response.blob();
            })
            .then(blob => {
                // Create a File object from the blob
                const file = new File([blob], 'popular-image.jpg', { type: blob.type });

                // Trigger file input change
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                // Hide suggestions
                clonedSuggestions.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching popular image for search:', error);
            });
    }

    /**
     * Set up popular queries click listeners
     */
    function setupPopularQueriesListener(popularQueryItems, searchInput, elements, searchTimeout) {
        if (!popularQueryItems || popularQueryItems.length === 0) return;

        popularQueryItems.forEach(item => {
            item.addEventListener('click', function () {
                const query = this.textContent.trim();
                if (!query) return;

                // Set search input value and trigger search
                searchInput.value = query;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));

                // Immediately search without waiting for debounce
                clearTimeout(searchTimeout);
                toggleVisibility(elements, true);
                fetchSearchResults(query, elements.dynamicProductsGrid);
            });
        });
    }

    /**
     * Fetch search results from Shopify Predictive Search API
     * @param {string} query - Search query
    * @param {HTMLElement} resultsContainer - Container for results
    */
    function fetchSearchResults(query, resultsContainer) {
        // Show loading state
        // showLoadingState(resultsContainer);

        // Fetch products from Shopify Predictive Search API
        fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`)
            .then(response => {
                if (!response.ok) throw new Error('Search request failed');
                return response.json();
            })
            .then(data => {
                // Hide image search modal if present
                const imageSearchModal = document.querySelector('.vs-snp-image-search-modal');
                if (imageSearchModal) imageSearchModal.style.display = 'none';

                // Process and display results
                displaySearchResults(data, resultsContainer);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                resultsContainer.innerHTML = '<p class="vs-sg-error">Error loading search results. Please try again.</p>';
            });
    }

    /**
     * Display search results
     */
    function displaySearchResults(data, resultsContainer) {
        const products = data.resources?.results?.products || [];

        if (products.length > 0) {
            resultsContainer.style.display = 'grid';

            // Build HTML for products
            let productsHTML = '';

            products.slice(0, CONFIG.maxSearchResults).forEach(product => {
                productsHTML += createProductHTML(product);
            });

            resultsContainer.innerHTML = productsHTML;
        } else {
            // No results found
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = '<p class="vs-sg-no-results">No products found. Try a different search term.</p>';
        }
    }

    /**
     * Create HTML for a single product
     */
    function createProductHTML(product) {
        return `
    <a href="${product.url}" class="vs-sg-product-image">
        <img src="${product.image || CONFIG.placeholderImage}" alt="${product.title}" loading="lazy" style="width: 6rem !important;">
            <div class="vs-content-wrapper">
                <div class="vs-sg-product-title">${product.title}</div>
                <div class="vs-sg-product-price">${product.price}</div>
            </div>
    </a>
    `;
    }

    /**
     * Add CSS styles for spinner and search results
     */
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
    @keyframes vs-sg-spin {
        to {transform: rotate(360deg); }
        }
    .vs-sg-spinner {
        animation: vs-sg-spin 1s linear infinite;
        }
    .vs-sg-product-title {
        margin - top: 8px;
    font-size: 14px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
        }
    .vs-sg-product-price {
        font - size: 13px;
    color: #555;
    margin-top: 4px;
        }
    .vs-sg-no-results, .vs-sg-error {
        text - align: center;
    padding: 20px;
    color: #555;
        }
    `;
        document.head.appendChild(style);
    }

    /**
     * Set up global document click handler
     */
    function setupGlobalClickHandler() {
        document.addEventListener('click', function (e) {
            e.stopPropagation();

            // Check if click is inside suggestions
            const isClickInside = e.target.closest('.vs-sg-search-suggestions-wrapper');

            if (!isClickInside) {
                // Reset UI elements
                resetUIElements();

                // Show search suggestions wrapper
                const searchSuggestionsWrapper = document.querySelector('form[action="/search"] .vs-sg-search-suggestions-wrapper');
                if (searchSuggestionsWrapper) {
                    searchSuggestionsWrapper.style.display = 'block';

                    // Reset visibility of sections
                    const dynamicResults = searchSuggestionsWrapper.querySelector('.vs-sg-dynamic-search-results');
                    const popularProducts = searchSuggestionsWrapper.querySelector('.vs-sg-popular-search-products');
                    const popularQuery = searchSuggestionsWrapper.querySelector('.vs-sg-popular-query');

                    if (dynamicResults) dynamicResults.style.display = 'none';
                    if (popularProducts) popularProducts.style.display = 'block';
                    if (popularQuery) popularQuery.style.display = 'block';
                }
            }
        });
    }

    /**
     * Reset UI elements after clicking outside
     */
    function resetUIElements() {
        // Remove post-image upload styling
        const elements = [
            '.vs-snp-image-search-modal-content',
            '.vs-snp-image-search-modal-header',
            '.vs-snp-image-upload-result-wrapper',
            '.vs-snp-image-search-modal-body',
            '.vs-snp-image-search-upload-area',
            '.vs-snp-image-search-results',
            '.vs-snp-image-search-popular'
        ];

        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.classList.remove('after');
        });

        // Additional resets
        const uploadArea = document.querySelector('.vs-snp-image-search-upload-area');
        if (uploadArea) uploadArea.classList.remove('has-content');

        const uploadButton = document.querySelector('.vs-snp-upload-another-button');
        if (uploadButton) uploadButton.style.display = 'none';
    }


    /**
     * Function to create skeleton loaders for popular products
     */
    function createPopularSkeletonItems(count) {
        const popularGrid = document.querySelector('.vs-sg-popular-products-grid');
        if (!popularGrid) return;

        popularGrid.innerHTML = ''; // Clear existing content

        for (let i = 0; i < count; i++) {
            const skeletonItem = document.createElement('a');
            skeletonItem.className = 'vs-sg-product-image vs-skeleton-item';
            skeletonItem.innerHTML = `
    <div class="vs-skeleton-img-placeholder" style="display:block;"></div>
    `;
            popularGrid.appendChild(skeletonItem);
        }
    }

    /**
     * Function to fetch recommended product images
     */
    function fetchRecommendedProducts() {
        const popularGrid = document.querySelector('.vs-sg-popular-products-grid');
        if (!popularGrid) return;

        // Show skeleton loader
        createPopularSkeletonItems(6); // Adjust based on expected number of products

        fetch(`${shopUrl}/apps/api/recommended-products`)
            .then((response) => response.json())
            .then((data) => {
                if (data?.products && data.products.nodes?.length > 0) {
                    displayRecommendedProducts(data.products.nodes);
                } else {
                    // hideSkeletonLoader();
                }
            })
            .catch((error) => {
                console.error('Error fetching recommended products:', error);
                // hideSkeletonLoader();
            });
    }

    /**
     * Function to display recommended product images
     */
    function displayRecommendedProducts(products) {
        const popularGrid = document.querySelector('.vs-sg-popular-products-grid');
        if (!popularGrid) return;

        popularGrid.innerHTML = ''; // Clear skeletons or old content

        products.forEach((product) => {
            if (product.featuredImage && product.featuredImage.url && product.handle) {
                const anchor = document.createElement('a');
                anchor.href = `/products/${product.handle}`;
                anchor.className = 'vs-sg-product-image';

                const img = document.createElement('img');
                img.src = product.featuredImage.url;
                img.alt = product.handle;
                img.loading = 'lazy';

                anchor.appendChild(img);

                // Attach click handler for image search functionality
                anchor.addEventListener('click', function (e) {
                    e.preventDefault(); // Prevent default link navigation
                    const imageUrl = img.src;
                    const imageAlt = img.alt;
                    if (!imageUrl) return;

                    // Find form context
                    const form = this.closest('form[action="/search"]');
                    const clonedSuggestions = this.closest('.vs-sg-search-suggestions-wrapper');

                    handlePopularImageClick(imageUrl, form, clonedSuggestions, imageAlt);
                });

                popularGrid.appendChild(anchor);
            }
        });
    }

    /**
     * Function to remove skeleton loaders
     */
    function hideSkeletonLoader() {
        const popularGrid = document.querySelector('.vs-sg-popular-products-grid');
        if (!popularGrid) return;

        const skeletons = popularGrid.querySelectorAll('.vs-skeleton-item');
        skeletons.forEach((item) => item.remove());

        if (popularGrid.children.length === 0) {
            // Optional: display a fallback message
            const noResults = document.createElement('p');
            noResults.textContent = 'No popular products found.';
            noResults.style.textAlign = 'center';
            noResults.style.width = '100%';
            popularGrid.appendChild(noResults);
        }
    }

    // Fetch recommended products on page load
    fetchRecommendedProducts();

    /**
    * Save search query to localStorage with timestamp
    * @param {string} query - Search query to save
      */
    function saveSearchQuery(query) {
        const now = new Date().getTime();
        const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        let searches = [];

        // Get existing searches or initialize empty array
        try {
            searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        } catch (e) {
            console.warn('Failed to parse recent searches from localStorage');
        }

        // Remove expired searches
        searches = searches.filter(item => now - item.timestamp < expirationTime);

        // Normalize query (trim + lowercase)
        const normalizedQuery = query.trim().toLowerCase();

        // Avoid duplicates
        if (!searches.some(item => item.query.toLowerCase() === normalizedQuery)) {
            searches.push({
                query: normalizedQuery,
                timestamp: now
            });

            // Save back to localStorage
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        }
    }

    /**
     * Get valid, non-expired recent searches
     * @returns {Array}
      */
    function getRecentSearches() {
        const now = new Date().getTime();
        const expirationTime = 7 * 24 * 60 * 60 * 1000;

        let searches = [];

        try {
            searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        } catch (e) {
            console.warn('Failed to parse recent searches');
        }

        // Filter out expired entries
        return searches.filter(item => now - item.timestamp < expirationTime);
    }

    /**
     * Clear expired searches from localStorage
     */
    function clearExpiredSearches() {
        const now = new Date().getTime();
        const expirationTime = 7 * 24 * 60 * 60 * 1000;

        let searches = [];

        try {
            searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        } catch (e) {
            console.warn('Failed to parse recent searches');
        }

        searches = searches.filter(item => now - item.timestamp < expirationTime);
        localStorage.setItem('recentSearches', JSON.stringify(searches));
    }

    // Run cleanup on page load
    document.addEventListener('DOMContentLoaded', function () {
        clearExpiredSearches();

        // Optionally: Set daily cleanup (every 24 hours)
        const lastCleanup = localStorage.getItem('lastSearchCleanup');
        const now = new Date().getTime();
        if (!lastCleanup || now - parseInt(lastCleanup) > 24 * 60 * 60 * 1000) {
            clearExpiredSearches();
            localStorage.setItem('lastSearchCleanup', now.toString());
        }
    });

    /**
     * Display recent searches in the popular queries section
     */
    function displayRecentSearches(searchInput) {
        const container = document.querySelector('.vs-sg-recent-search-query-items');
        const recentSearchSection = document.querySelector('.vs-sg-recent-search-query');

        if (!container || !recentSearchSection) return;

        const recentQueries = getRecentSearches();

        // Clear existing items except original static ones (if any)
        Array.from(container.children).forEach(child => {
            if (!child.classList.contains('original-static-item')) {
                child.remove();
            }
        });

        if (recentQueries.length === 0) {
            // Hide the entire recent search section if no recent searches
            recentSearchSection.style.display = 'none';
            return;
        }

        // Show the recent search section
        recentSearchSection.style.display = 'block';

        // Append recent searches
        recentQueries.slice(0, 10).forEach(item => {
            const span = document.createElement('span');
            span.className = 'vs-sg-query-item recent-search-item';
            span.textContent = item.query;

            // Add click handler to trigger search
            span.addEventListener('click', function () {
                searchInput.value = item.query;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            });

            container.appendChild(span);
        });
    }
    // displayRecentSearches();


    async function trackSearchClick(type, query, productId = null) {
        console.log('Tracking click:', type, query, productId);
        try {
            await fetch(`${shopUrl}/apps/api/track-search-clicks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    query,
                    productId,
                    shopDomain: window.location.hostname
                })
            }).then(response => response.json()).then(data => console.log(data)).catch(error => console.error(error));
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    }

    
});