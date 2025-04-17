import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose, { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import PaymentActivity, { IPaymentActivity } from "@/models/payment-activity";
import { User } from "@/models/User";
import Wallet, { IWallet } from "@/models/wallet";

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
        const userId = (await params).userId;
        // Kiểm tra ID hợp lệ
        if (!isValidObjectId(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Lấy các tham số từ URL
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const timeQuery: TimeQuery = {};
        if (startDate) {
            timeQuery.$gte = new Date(startDate);
        }
        if (endDate) {
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);
            timeQuery.$lte = endDateTime;
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const baseQuery = { customer: userObjectId };
        const fullQuery = Object.keys(timeQuery).length > 0
            ? { ...baseQuery, createdAt: timeQuery }
            : baseQuery;
        const tokenUsages = await PaymentActivity.find({
            ...fullQuery,
            type: "token_usage",
        }).lean();

        let totalSpent = 0;
        tokenUsages.forEach(doc => {
            if (doc.tokensEarned !== undefined) {
                totalSpent += Number(doc.tokensEarned);
            }
        });
        const bankTransactions = await PaymentActivity.find({
            ...fullQuery,
            type: "bank",
        }).lean();
        let totalEarned = 0;
        bankTransactions.forEach(doc => {
            if (doc.tokensEarned !== undefined) {
                totalEarned += Number(doc.tokensEarned);
            }
        });
        const transactionsWithAmount = await PaymentActivity.find({
            ...fullQuery,
            amount: { $exists: true, $gt: 0 }
        }).lean();

        let avgTransactionValue = 0;
        if (transactionsWithAmount.length > 0) {
            const total = transactionsWithAmount.reduce((sum, doc) => sum + Number(doc.amount || 0), 0);
            avgTransactionValue = total / transactionsWithAmount.length;
        }
        const wallet = await Wallet.findOne({ customer: userObjectId }).lean() as IWallet | null;
        const totalTokens = wallet?.totalTokens ?? 0;
        // Tổng số giao dịch
        const totalTransactions = await PaymentActivity.countDocuments(fullQuery);
        // Lấy ngày giao dịch gần nhất
        const lastTransaction = await PaymentActivity.findOne(fullQuery)
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