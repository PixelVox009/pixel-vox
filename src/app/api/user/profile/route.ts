// app/api/user/profile/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Wallet from "@/models/wallet";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await Wallet.findOne({ customer: session.user.id });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({
            id: user._id,
            customer: user.customer,
            balance: user.balance || 0,
            totalRecharged: user.totalRecharged || 0,
            totalTokens: user.totalTokens || 0,
            totalSpent: user.totalSpent || 0,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}