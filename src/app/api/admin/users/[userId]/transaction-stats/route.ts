import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import PaymentActivity, { IPaymentActivity } from "@/models/payment-activity";

import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import Wallet, { IWallet } from "@/models/wallet";
import { isValidObjectId } from "mongoose";

interface TimeQuery {
    $gte?: Date;
    $lte?: Date;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        await dbConnect();
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

        // Lấy các tham số từ URL
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Kiểm tra người dùng tồn tại
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Xây dựng query để tính toán số liệu thống kê
        const timeQuery: TimeQuery = {};
        if (startDate || endDate) {
            if (startDate) {
                timeQuery.$gte = new Date(startDate);
            }
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                timeQuery.$lte = endDateTime;
            }
        }

        // Tính toán các thống kê giao dịch
        const queryBase = { customer: userId };
        const timeFilter = Object.keys(timeQuery).length > 0 ? { createdAt: timeQuery } : {};
        const query = { ...queryBase, ...timeFilter };

        // Tính tổng token đã sử dụng
        const totalSpentAgg = await PaymentActivity.aggregate([
            { $match: { ...query, tokensUsed: { $exists: true, $gt: 0 } } },
            { $group: { _id: null, total: { $sum: "$tokensUsed" } } }
        ]);
        const totalSpent = totalSpentAgg.length > 0 ? totalSpentAgg[0].total : 0;

        // Tính tổng token đã nhận
        const totalEarnedAgg = await PaymentActivity.aggregate([
            { $match: { ...query, tokensEarned: { $exists: true, $gt: 0 } } },
            { $group: { _id: null, total: { $sum: "$tokensEarned" } } }
        ]);
        const totalEarned = totalEarnedAgg.length > 0 ? totalEarnedAgg[0].total : 0;

        // Tính giá trị trung bình của giao dịch
        const avgValueAgg = await PaymentActivity.aggregate([
            { $match: { ...query, amount: { $exists: true, $gt: 0 } } },
            { $group: { _id: null, avg: { $avg: "$amount" } } }
        ]);
        const avgTransactionValue = avgValueAgg.length > 0 ? avgValueAgg[0].avg : 0;

        // Lấy ví của người dùng
        const wallet = await Wallet.findOne({ customer: userId }).lean() as IWallet | null;
        const totalTokens = wallet?.totalTokens ?? 0;

        // Tổng số giao dịch
        const totalTransactions = await PaymentActivity.countDocuments(query);

        // Lấy ngày giao dịch gần nhất
        const lastTransaction = await PaymentActivity.findOne(query)
            .sort({ createdAt: -1 })
            .lean() as IPaymentActivity | null;
        const lastTransactionDate = lastTransaction ? lastTransaction.createdAt : null;

        return NextResponse.json({
            totalSpent,
            totalEarned,
            avgTransactionValue,
            totalTokens,
            totalTransactions,
            lastTransactionDate
        });
    } catch (error) {
        console.error('Error fetching transaction stats:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}