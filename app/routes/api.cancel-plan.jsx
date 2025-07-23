import { json } from "@remix-run/node";
import {
    authenticate,
    PRO_ANNUAL_PLAN,
    PRO_PLAN,
} from "../shopify.server"; // Adjust path if needed

export const action = async ({ request }) => {
    if (request.method !== "POST") {
        return json({ error: "Method Not Allowed" }, { status: 405 });
    }

    const formData = await request.formData();
    console.log("Cancelling Subscription Formdata:", formData);
    const plan = formData.get("plan");

    const { billing } = await authenticate.admin(request);

    try {
        if (plan === "pro_plan") {
            const billingCheck = await billing.require({
                plans: [PRO_PLAN],
                onFailure: async () => billing.request({ plan: PRO_PLAN }),
            });

            const subscription = billingCheck.appSubscriptions[0];
            await billing.cancel({
                subscriptionId: subscription.id,
                // isTest: false,
                isTest: true,
                prorate: true,
            });
        }

        if (plan === "pro_plan_annual") {
            const billingCheck = await billing.require({
                plans: [PRO_ANNUAL_PLAN],
                onFailure: async () => billing.request({ plan: PRO_ANNUAL_PLAN }),
            });

            const subscription = billingCheck.appSubscriptions[0];
            await billing.cancel({
                subscriptionId: subscription.id,
                // isTest: false,
                isTest: true,
                prorate: true,
            });
        }
    } catch (error) {
        console.error("Subscription cancellation error:", error);
        let errorMessage = "An unknown error occurred during cancellation.";
        if (error.response && error.response.errors) {
            errorMessage = JSON.stringify(error.response.errors);
        } else if (error.message) {
            errorMessage = error.message;
        }
        return json({ success: false, error: errorMessage }, { status: 500 });
    }
    return null;
};