import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import Wallet from "@/models/wallet";
import { isValidObjectId } from "mongoose";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        await dbConnect();

        // Kiểm tra quyền admin
        const session = await getServerSession(authOptions);
        if (!session?.user?.role || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = params;

        // Kiểm tra ID hợp lệ
        if (!isValidObjectId(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Tìm user
        const user = await User.findById(userId).select('-hashedPassword').lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Lấy thông tin ví
        const wallet = await Wallet.findOne({ customer: userId }).lean();

        return NextResponse.json({
            ...user,
            wallet: wallet || null
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}