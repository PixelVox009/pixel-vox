// api/user/transaction-history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import PaymentActivity from "@/models/payment-activity";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        // Lấy phiên hiện tại
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Lấy tham số phân trang nếu có
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "10");

        // Lấy lịch sử giao dịch từ bảng PaymentActivity
        const transactions = await PaymentActivity.find({ customer: session.user.id })
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất
            .limit(limit)
            .lean(); // Chuyển đổi sang plain JavaScript object

        return NextResponse.json({
            transactions,
            success: true
        });
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}