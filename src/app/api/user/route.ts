// app/api/users/me/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { IUser, User } from "@/models/User";
import Wallet, { IWallet } from "@/models/wallet";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface UserResponse {
    id: string;
    name: string | null;
    email: string | null;
    paymentCode?: string;
    balance: number;
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne<IUser>({
            $or: [
                { _id: session.user.id },
                { email: session.user.email }
            ]
        }).lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const wallet = await Wallet.findOne<IWallet>({ customer: user._id }).lean();

        const response: UserResponse = {
            id: typeof user._id === 'string'
                ? user._id
                : user._id instanceof Types.ObjectId
                    ? user._id.toString()
                    : String(user._id),
            name: user.name ?? null,
            email: user.email ?? null,
            paymentCode: user.paymentCode,
            balance: wallet?.balance ?? 0
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error("Error fetching user information:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}