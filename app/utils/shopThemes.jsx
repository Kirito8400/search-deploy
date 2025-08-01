// Function to fetch live theme ID
export async function getLiveThemeId(admin) {
  try {
    // Fetch shop themes
    const response = await admin.graphql(`
      query {
        themes(first: 10) {
          edges {
            node {
              id
              name
              role
            }
          }
        }
      }
    `);  
    
    const responseData = await response.json();
    const themes = responseData?.data?.themes?.edges || [];
    
    // Find and extract live theme ID
    const liveTheme = themes.find(theme => theme.node.role === "MAIN");
    return liveTheme?.node?.id?.replace("gid://shopify/OnlineStoreTheme/", "") || null;
  } catch (error) {
    console.error('Error fetching live theme ID:', error);
    throw error; // Or return null if you prefer to handle errors gracefully
  }
}

// Function to fetch 10 shop themes
export async function fetchShopThemes(admin) {
  const query = `
    query {
      themes(first: 10) {
        edges {
          node {
            id
            name
            role
          }
        }
      }
    }
  `;

  const response = await admin.graphql(query);
  const responseData = await response.json();
  return responseData?.data?.themes?.edges || [];
}

// Function to find live theme from fetched themes
export function findLiveTheme(themes) {
  return themes.find((theme) => theme.node.role === "MAIN");
}

// Function to extract theme ID from theme object
export function extractThemeId(themeId) {
  if (!themeId) return null;
  return themeId.replace("gid://shopify/OnlineStoreTheme/", "");
}
