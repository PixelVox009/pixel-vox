import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { IUser, User } from "@/models/User";
import Wallet from "@/models/wallet";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        // Kiểm tra quyền admin
        const session = await getServerSession(authOptions);
        if (!session?.user?.role || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Lấy các tham số từ URL
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role') || '';
        // Xây dựng query
        const query: Record<string, unknown> = {};
        // Filter theo role
        if (role && role !== '') {
            query.role = role;
        }
        // Tìm kiếm theo name hoặc email hoặc paymentCode
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { paymentCode: { $regex: search, $options: 'i' } }
            ];
        }
        // Tính toán skip cho phân trang
        const skip = (page - 1) * limit;
        // Thực hiện truy vấn với phân trang
        const users = await User.find(query)
            .select('-hashedPassword')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean<IUser[]>();
        // Lấy tổng số bản ghi phù hợp với query
        const total = await User.countDocuments(query);
        // Tính toán thông tin phân trang
        const totalPages = Math.ceil(total / limit);
        const from = skip + 1;
        const to = Math.min(skip + limit, total);
        // Lấy thông tin ví cho mỗi người dùng
        const userIds = users.map((user: IUser) => user._id);
        const wallets = await Wallet.find({ customer: { $in: userIds } }).lean();
        // Map wallets vào users
        const usersWithWallets = users.map(user => {
            const wallet = wallets.find(w => w.customer.toString() === (user)._id.toString());
            return {
                ...user,
                wallet: wallet || {
                    balance: 0,
                    totalRecharged: 0,
                    totalTokens: 0,
                    totalSpent: 0,
                    createdAt: null,
                    updatedAt: null,
                },
            };
        });

        return NextResponse.json({
            users: usersWithWallets,
            pagination: {
                total,
                page,
                limit,
                from,
                to,
                totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
