// app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import Wallet from "@/models/wallet";

export async function GET(req: NextRequest) {
    try {
        // Kiểm tra phiên đăng nhập
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Tìm user hiện tại và nạp thông tin wallet
        const user = await User.findOne({
            $or: [
                { _id: session.user.id },
                { email: session.user.email }
            ]
        }).lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Lấy thông tin wallet
        const wallet = await Wallet.findOne({ customer: user._id }).lean();

        // Trả về thông tin người dùng
        return NextResponse.json({
            id: user._id,
            name: user.name,
            email: user.email,
            paymentCode: user.paymentCode, // Sử dụng trực tiếp từ bảng User
            balance: wallet?.balance || 0
        });

    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}