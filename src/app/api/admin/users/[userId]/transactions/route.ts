import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import PaymentActivity from "@/models/payment-activity";

import { isValidObjectId } from "mongoose";
import { User } from "@/models/User";
import dbConnect from "@/lib/db";
interface Query {
    customer: string;
    type?: string;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
    $or?: Array<Record<string, unknown>>;
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
        const type = searchParams.get('type') || 'all';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const search = searchParams.get('search') || '';
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = parseInt(searchParams.get('skip') || '0');

        // Kết nối database
        

        // Kiểm tra người dùng tồn tại
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Xây dựng query
        const query: Query = { customer: userId };

        // Filter theo type
        if (type !== 'all') {
            query.type = type;
        }

        // Filter theo ngày
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                query.createdAt.$lte = endDateTime;
            }
        }

        // Tìm kiếm
        if (search) {
            query.$or = [
                { transaction: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Thực hiện query với phân trang
        const transactions = await PaymentActivity.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit + 1) // Lấy thêm 1 để kiểm tra có còn dữ liệu không
            .lean();

        // Kiểm tra nếu còn dữ liệu
        const hasMore = transactions.length > limit;
        const results = hasMore ? transactions.slice(0, limit) : transactions;

        // Tổng số bản ghi phù hợp với filter
        const total = await PaymentActivity.countDocuments(query);

        return NextResponse.json({
            transactions: results,
            total,
            hasMore,
            next: hasMore ? skip + limit : null
        });
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}