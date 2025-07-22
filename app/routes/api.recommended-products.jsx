


import { authenticate } from '../shopify.server';

const POPULAR_PRODUCTS_QUERY = `#graphql
    query RecommendedProducts {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
        nodes {
        id
        title
        handle
        featuredImage {
            url
            altText
        }
        priceRange {
            minVariantPrice {
            amount
            currencyCode
            }
        }
        }
    }
    }
`;

export async function loader({ request }) {
    // Authenticate with Shopify
    // const { admin } = await authenticate.admin(request);
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session) {
        return json({ error: "No session found" });
    }

    // GraphQL Query to Fetch Products
    const response = await admin.graphql(POPULAR_PRODUCTS_QUERY);

    const responseBody = await response.json();
    return responseBody.data;
}