


import { useLoaderData } from "@remix-run/react";
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

// export default function PopularProducts() {
//     const { products } = useLoaderData();
//     console.log("products", products)

//     return (
//         <section>
//             <h2>Popular Products</h2>
//             <div style={{ display: 'flex', gap: '1rem' }}>
//                 {products.nodes.map((product) => (
//                     <div key={product.id}>
//                         {product.featuredImage && (
//                             <img
//                                 src={product.featuredImage.url}
//                                 alt={product.featuredImage.altText || product.title}
//                                 width={200}
//                             />
//                         )}
//                         <h3>{product.title}</h3>
//                         <p> 
//                             {product.priceRange.minVariantPrice.amount}{' '}
//                             {product.priceRange.minVariantPrice.currencyCode}
//                         </p>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// }