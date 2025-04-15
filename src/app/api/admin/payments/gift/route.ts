// app/api/admin/payments/gift/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import PaymentActivity from "@/models/payment-activity";
import Wallet from "@/models/wallet";
import { isValidObjectId } from "mongoose";

export async function POST(req: NextRequest) {
    try {
        // Kiểm tra quyền admin
        const session = await getServerSession(authOptions);
        if (!session?.user?.role || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Lấy dữ liệu từ request body
        const data = await req.json();
        const { customer, wallet, tokensEarned, description, type, status } = data;

        // Validate dữ liệu
        if (!customer || !wallet || !tokensEarned || tokensEarned <= 0) {
            return NextResponse.json({ error: "Invalid gift parameters" }, { status: 400 });
        }

        if (!isValidObjectId(customer) || !isValidObjectId(wallet)) {
            return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
        }

        // Kết nối database
        await dbConnect();

        // Tìm ví của người dùng
        const userWallet = await Wallet.findById(wallet);
        if (!userWallet || userWallet.customer.toString() !== customer) {
            return NextResponse.json({ error: "Wallet not found or does not belong to user" }, { status: 404 });
        }

        // Tạo mã giao dịch
        const transaction = `BONUS${Date.now()}`;

        // Lấy số dư hiện tại
        const oldBalance = userWallet.balance;
        const newBalance = oldBalance + tokensEarned;

        // Tạo bản ghi thanh toán mới
        const paymentActivity = new PaymentActivity({
            transaction,
            oldBalance,
            newBalance,
            customer,
            wallet,
            amount: 0, // Tặng token nên không có giá trị tiền
            type: type || "bonus",
            status: status || "success",
            description: description || `Admin tặng ${tokensEarned} token`,
            tokensEarned,
            depositDiscountPercent: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0
        });

        // Lưu bản ghi thanh toán
        await paymentActivity.save();

        // Cập nhật ví của người dùng
        userWallet.balance = newBalance;
        userWallet.totalTokens += tokensEarned;
        userWallet.updatedAt = new Date();
        await userWallet.save();
        // Trả về kết quả thành công
        return NextResponse.json({
            success: true,
            transaction,
            tokensEarned,
            newBalance,
            paymentActivity: paymentActivity.toObject()
        }, { status: 201 });
    } catch (error) {
        console.error('Error gifting tokens:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}