import { authenticate, PRO_ANNUAL_PLAN, PRO_PLAN } from "../shopify.server";
import { json } from "@remix-run/node";
import { getAppHandle } from "../utils/checkAppEmbed";

export const action = async ({ request }) => {
  const { billing, session, admin } = await authenticate.admin(request);
  const shop = session.shop.replace(".myshopify.com", "");

  const handle = await getAppHandle(admin);

  const formData = await request.formData();
  const plan = formData.get("plan");

  const returnUrl = `https://admin.shopify.com/store/${shop}/apps/${handle}/app/plan`;

  console.log("Form Data:", plan);

  if (plan === "pro_plan") {
    await billing.require({
      plans: [PRO_PLAN],
      onFailure: async () =>
        billing.request({
          plan: PRO_PLAN,
          // isTest: false,
          isTest: true,
          returnUrl: returnUrl,
        }),
    });
  }
  if (plan === "pro_plan_annual") {
    await billing.require({
      plans: [PRO_ANNUAL_PLAN],
      onFailure: async () =>
        billing.request({
          plan: PRO_ANNUAL_PLAN,
          trialDays: 7,
          //   isTest: false,
          isTest: true,
          returnUrl: returnUrl,
        }),
    });
  }

  return json({ success: true, plan });
};
