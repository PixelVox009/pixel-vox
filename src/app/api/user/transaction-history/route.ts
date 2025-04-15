// api/user/transaction-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import PaymentActivity from "@/models/payment-activity";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "10");
        const type = searchParams.get("type");
        const query: { customer: string; type?: string; tokensEarned?: { $gt: number } } = { customer: session.user.id };
        if (type) {
            if (type === "all") {
                // Không thêm điều kiện
            } else if (type === "consumed") {
                query.type = "token_usage";
            } else if (type === "purchased") {
                query.type = "bank";
            } else if (type === "obtained") {
                query.tokensEarned = { $gt: 0 };
            } else {
                query.type = type;
            }
        }
        const transactions = await PaymentActivity.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({
            transactions,
            success: true
        });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}