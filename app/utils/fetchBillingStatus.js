import { authenticate, PRO_ANNUAL_PLAN, PRO_PLAN } from "../shopify.server";


export async function fetchBillingStatus(request) {
  try {
  const { billing } = await authenticate.admin(request);

  const hasActivePayment = await billing.check({
    plans: [PRO_PLAN, PRO_ANNUAL_PLAN],
    isTest: true,
  });

  const CurrentPlan = hasActivePayment?.appSubscriptions[0]?.name || "";
  const isProMonthly = CurrentPlan === "Monthly subscription";
  const isProAnnual = CurrentPlan === "Annual subscription";

    return {
      CurrentPlan,
      isProMonthly,
      isProAnnual,
    };
  } catch (error) {
    console.error("Failed to fetch billing status:", error);
    throw error; // Let the calling function handle the error
  }
}
