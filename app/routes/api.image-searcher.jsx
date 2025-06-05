import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  console.log("Proxy hits");
  //   const { admin } = await authenticate.admin(request);
  const { session, admin } = await authenticate.public.appProxy(request);

  if (!session) {
    return json({ error: "No session found" });
  }

  const formData = await request.formData();
  const imageFile = formData.get("image");

  if (!imageFile) {
    return json({ error: "No image provided" });
  }

  try {
    // Convert the file to base64 for API transmission
    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Call the image similarity search service
    const similarProducts = await findSimilarProducts(base64Image, admin);

    return json({
      success: true,
      products: similarProducts,
    });
  } catch (error) {
    console.error("Error searching for similar products:", error);
    return json({
      error: "Failed to search for similar products: " + error.message,
    });
  }
};

// Helper function to find similar products using image features
async function findSimilarProducts(base64Image, admin) {
  // 1. Extract image features using Vision API
  const imageFeatures = await extractImageFeatures(base64Image);

  // 2. Fetch products from the store
  const productsResponse = await admin.graphql(`
    query {
      products(first: 100) {
        edges {
          node {
            id
            title
            description
            featuredImage {
              url
              altText
            }
            handle
            tags
            productType
          }
        }
      }
    }
  `);

  const productsData = await productsResponse.json();
  const products = productsData.data.products.edges.map(({ node }) => node);

  // 3. Filter and rank products based on similarity
  const rankedProducts = rankProductsBySimilarity(products, imageFeatures);

  // Return the top matches (limit to 10)
  return rankedProducts.slice(0, 20);
}

// Extract features from the uploaded image
async function extractImageFeatures(base64Image) {
  // try {
  // Google Cloud Vision API key
  const API_KEY = process.env.API_KEY || "";

  // Prepare the request body for Google Cloud Vision API
  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          { type: "LABEL_DETECTION", maxResults: 20 },
          { type: "IMAGE_PROPERTIES", maxResults: 10 },
          { type: "OBJECT_LOCALIZATION", maxResults: 10 },
        ],
      },
    ],
  };

  // Make the API request
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  const result = await response.json();
  console.log("Vision API result:", result);

  // Extract the relevant data from the response
  try {
    if (!result.responses || !result.responses[0]) {
      throw new Error("Invalid response from Vision API");
    }

    const visionResponse = result.responses[0];

    // Extract labels
    const labels = visionResponse.labelAnnotations
      ? visionResponse.labelAnnotations.map((label) =>
          label.description.toLowerCase(),
        )
      : [];
    console.log("Labels:", labels);

    // Extract colors
    const colors = visionResponse.imagePropertiesAnnotation
      ? visionResponse.imagePropertiesAnnotation.dominantColors.colors.map(
          (color) => {
            const r = Math.round(color.color.red || 0);
            const g = Math.round(color.color.green || 0);
            const b = Math.round(color.color.blue || 0);
            return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          },
        )
      : ["#e3e3e3"];
    console.log("Colors:", colors);

    // Extract objects
    const objects = visionResponse.localizedObjectAnnotations
      ? visionResponse.localizedObjectAnnotations.map((obj) =>
          obj.name.toLowerCase(),
        )
      : [];
    console.log("Objects:", objects);

    // For now, return placeholder data
    return {
      labels,
      colors,
      objects,
      rawDescription: JSON.stringify(visionResponse),
    };
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// Rank products based on similarity to the uploaded image
function rankProductsBySimilarity(products, imageFeatures) {
  return products
    .map((product) => {
      let score = 0;
      const productText = (
        product.title +
        " " +
        (product.description || "")
      ).toLowerCase();

      // 1. Color matching (highest priority)
      if (imageFeatures.colors && imageFeatures.colors.length > 0) {
        imageFeatures.colors.forEach((color, index) => {
          // Give higher weight to dominant colors (earlier in the array)
          const colorWeight = 25 - index * 2;
          if (
            productText.includes(color.replace("#", "")) ||
            productText.includes(getColorName(color))
          ) {
            score += colorWeight;
          }
        });
      }

      // 2. Label matching (medium priority)
      imageFeatures.labels.forEach((label) => {
        if (productText.includes(label.toLowerCase())) {
          score += 15;
        }
        // Check product tags for label matches
        if (product.tags) {
          const tags = Array.isArray(product.tags)
            ? product.tags
            : product.tags.split(",");
          if (
            tags.some((tag) => tag.toLowerCase().includes(label.toLowerCase()))
          ) {
            score += 10;
          }
        }
        // Check product type for label matches
        if (
          product.productType &&
          product.productType.toLowerCase().includes(label.toLowerCase())
        ) {
          score += 10;
        }
      });

      // 3. Object matching (lowest priority)
      imageFeatures.objects.forEach((object) => {
        if (productText.includes(object.toLowerCase())) {
          score += 5;
        }
        // Check product tags for object matches
        if (product.tags) {
          const tags = Array.isArray(product.tags)
            ? product.tags
            : product.tags.split(",");
          if (
            tags.some((tag) => tag.toLowerCase().includes(object.toLowerCase()))
          ) {
            score += 3;
          }
        }
      });

      return {
        ...product,
        similarityScore: score,
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .filter((product) => product.similarityScore > 0);
}

// Helper function to get basic color names from hex codes
function getColorName(hex) {
  // Remove the hash if present
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Simple color name mapping based on RGB values
  if (r > 200 && g > 200 && b > 200) return "white";
  if (r < 50 && g < 50 && b < 50) return "black";
  if (r > 200 && g < 100 && b < 100) return "red";
  if (r < 100 && g > 200 && b < 100) return "green";
  if (r < 100 && g < 100 && b > 200) return "blue";
  if (r > 200 && g > 200 && b < 100) return "yellow";
  if (r > 200 && g < 100 && b > 200) return "purple";
  if (r < 100 && g > 200 && b > 200) return "cyan";
  if (r > 200 && g > 100 && b < 100) return "orange";
  if (r > 150 && g > 100 && b > 100) return "brown";
  return "gray";
}

// export default function ImageSearcher() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const actionData = useActionData();
//   const submit = useSubmit();
//   console.log("actionData products:", actionData);

//   const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const handleSubmit = () => {
//     if (!file) return;

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("image", file);

//     submit(formData, { method: "post", encType: "multipart/form-data" });

//     // Reset loading state after submission completes
//     setTimeout(() => setLoading(false), 500);
//   };

//   const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

//   const fileUpload = !file && (
//     <DropZone.FileUpload actionHint="or drop files to upload" />
//   );

//   const uploadedFile = file && (
//     <BlockStack>
//       <Thumbnail
//         size="large"
//         alt={file.name}
//         source={
//           validImageTypes.includes(file.type)
//             ? window.URL.createObjectURL(file)
//             : null
//         }
//       />
//       <div>
//         <Text variant="bodyMd" fontWeight="bold">
//           {file.name}
//         </Text>
//         <Text variant="bodyMd" color="subdued">
//           {file.size} bytes
//         </Text>
//       </div>
//     </BlockStack>
//   );

//   return (
//     <Page
//       title="Visual Product Search"
//       primaryAction={{
//         content: "Search Similar Products",
//         onAction: handleSubmit,
//         disabled: !file || loading,
//       }}
//     >
//       <Layout>
//         <Layout.Section>
//           <LegacyCard sectioned>
//             <BlockStack vertical>
//               <Text variant="headingMd">Upload a product image</Text>
//               <Text variant="bodyMd" color="subdued">
//                 Upload an image to find visually similar products in your store
//               </Text>
//               <DropZone
//                 accept="image/*"
//                 type="image"
//                 allowMultiple={false}
//                 onDrop={handleDropZoneDrop}
//               >
//                 {uploadedFile}
//                 {fileUpload}
//               </DropZone>
//               {loading && (
//                 <div style={{ textAlign: "center", padding: "20px" }}>
//                   <Spinner
//                     accessibilityLabel="Searching for similar products"
//                     size="large"
//                   />
//                   <div style={{ marginTop: "10px" }}>
//                     <Text>Searching for similar products...</Text>
//                   </div>
//                 </div>
//               )}
//             </BlockStack>
//           </LegacyCard>
//         </Layout.Section>

//         {actionData?.error && (
//           <Layout.Section>
//             <Banner status="critical">{actionData.error}</Banner>
//           </Layout.Section>
//         )}

//         {actionData?.products && actionData.products.length > 0 && (
//           <Layout.Section>
//             <LegacyCard title="Similar Products">
//               <ResourceList
//                 resourceName={{ singular: "product", plural: "products" }}
//                 items={actionData.products}
//                 renderItem={(product) => (
//                   <ResourceItem
//                     id={product.id}
//                     media={
//                       product.featuredImage ? (
//                         <Thumbnail
//                           source={product.featuredImage.url}
//                           alt={product.featuredImage.altText || product.title}
//                         />
//                       ) : (
//                         <div
//                           style={{
//                             backgroundColor: "#f4f6f8",
//                             height: "40px",
//                             width: "40px",
//                           }}
//                         />
//                       )
//                     }
//                     name={product.title}
//                     accessibilityLabel={`View details for ${product.title}`}
//                   >
//                     <BlockStack>
//                       <Text variant="bodyMd" fontWeight="bold">
//                         {product.title}
//                       </Text>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             backgroundColor: "#e3f1df",
//                             color: "#414f3e",
//                             padding: "2px 8px",
//                             borderRadius: "4px",
//                             fontSize: "12px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Match:{" "}
//                           {Math.min(
//                             100,
//                             Math.round(product.similarityScore * 2),
//                           )}
//                           %
//                         </div>
//                         {product.productType && (
//                           <Text variant="bodySm" color="subdued">
//                             {product.productType}
//                           </Text>
//                         )}
//                       </div>
//                       <Text variant="bodyMd">
//                         {product.description
//                           ? product.description.substring(0, 100) +
//                             (product.description.length > 100 ? "..." : "")
//                           : "No description available"}
//                       </Text>
//                     </BlockStack>
//                   </ResourceItem>
//                 )}
//               />
//             </LegacyCard>
//           </Layout.Section>
//         )}

//         {actionData?.products && actionData.products.length === 0 && (
//           <Layout.Section>
//             <Banner status="info">
//               No similar products found. Try uploading a different image.
//             </Banner>
//           </Layout.Section>
//         )}
//       </Layout>
//     </Page>
//   );
// }
