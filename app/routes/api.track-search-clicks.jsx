import { json } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from '../shopify.server';

// Received data: {
// 17:24:38 │                     remix │   type: 'visual_search',
// 17:24:38 │                     remix │   query: 'image_searched',
// 17:24:38 │                     remix │   productId: 'image_searched',
// 17:24:38 │                     remix │   shopDomain: 'lathe-base.myshopify.com'
// 17:24:38 │                     remix │ }
// Received data: {
// 17:25:59 │                     remix │   type: 'popular_query',
// 17:25:59 │                     remix │   query: 'yep',
// 17:25:59 │                     remix │   productId: null,
// 17:25:59 │                     remix │   shopDomain: 'lathe-base.myshopify.com'
// 17:25:59 │                     remix │ }
export async function action({ request }) {
    const { session } = await authenticate.public.appProxy(request);
    if (!session) {
        return json({ error: "No session found" });
    }
    const data = await request.json();
    try {
        console.log("Received data:", data);

        await prisma.searchClick.create({
            data: {
                type: data.type, // 'visual_search', 'popular_query', or 'recent_query'
                query: data.query,
                productId: null,
                shopDomain: data.shopDomain,
                timestamp: new Date()
            }
        });

        return json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error tracking search click:", error);
        return json({ success: false }, { status: 500 });
    }
}