import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import PaymentActivity from "@/models/payment-activity";
import dbConnect from "@/lib/db";


export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        // Kiểm tra phiên đăng nhập
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Không được phép" },
                { status: 401 }
            );
        }
        // Lấy userId từ query hoặc session
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId") || session.user.id;

        // Tìm khách hàng từ userId
        const customer = await User.findOne({
            $or: [
                { _id: userId },
                { email: session.user.email }
            ]
        });
        if (!customer) {
            return NextResponse.json(
                { error: "Không tìm thấy khách hàng" },
                { status: 404 }
            );
        }
        // Lấy các giao dịch thành công gần đây (trong vòng 15 phút qua)
        const fifteenMinutesAgo = new Date();
        fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

        const recentPayments = await PaymentActivity.find({
            customer: customer._id,
            type: "bank",
            status: "success",
            createdAt: { $gte: fifteenMinutesAgo }
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        return NextResponse.json({
            success: true,
            recentPayments,
            hasRecentPayment: recentPayments.length > 0
        });
    } catch (error) {
        console.error("Lỗi kiểm tra thanh toán:", error);
        return NextResponse.json(
            { error: "Lỗi server" },
            { status: 500 }
        );
    }
}