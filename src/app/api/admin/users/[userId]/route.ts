import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Wallet from "@/models/wallet";
import { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        // Kiểm tra quyền admin
        const session = await getServerSession(authOptions);
        if (!session?.user?.role || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = params.userId;

        // Kiểm tra ID hợp lệ
        if (!isValidObjectId(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Kết nối database
        await dbConnect();

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
    } catch (error: any) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}