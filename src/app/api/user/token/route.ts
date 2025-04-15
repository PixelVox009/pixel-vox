// api/user/token-balance.ts hoặc route.ts
import dbConnect from "@/lib/db";
import Wallet from "@/models/wallet";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const wallet = await Wallet.findOne({ customer: session.user.id });
        if (!wallet) {
            return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
        }
        return NextResponse.json({
            balance: wallet.balance,
            totalRecharged: wallet.totalRecharged || 0,
            totalSpent: wallet.totalSpent || 0,
            totalTokens: wallet.totalTokens || wallet.balance
        });
    } catch (error) {
        console.error("Error fetching token balance:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}