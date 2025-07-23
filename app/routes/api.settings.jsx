import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { session, admin } = await authenticate.public.appProxy(request);
  if (!session) {
    return json({ error: "No session found" });
  }
  // const { admin } = await authenticate.admin(request);

  // try {
  const response = await admin.graphql(`
    query{
      shop{
        id
      }
    }
  `)

  const metafields = await admin.graphql(`
      query GetShopMetafield {
        shop {
          metafield(namespace: "vs_settings_namespace", key: "vs_settings_key") {
            id
            namespace
            key
            value
          }
        }
      }
    `)

  const shopData = await response.json();
  const shopId = shopData.data.shop.id;
  const metafieldsData = await metafields.json();
  const metafieldsValue = metafieldsData.data?.shop?.metafield?.value;

  if (metafieldsValue) {
    return json({ shopId, settings: JSON.parse(metafieldsValue) })
  }
  return json({ shopId, settings: metafieldsValue });
}