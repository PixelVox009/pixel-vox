// app/api/admin/transactions/route.ts
import dbConnect from '@/lib/db';
import PaymentActivity from '@/models/payment-activity';
import { NextResponse } from 'next/server';
interface Filter {
    status: string;
    type: string;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const year = searchParams.get('year');
        const type = searchParams.get('type');

        // Nếu request yêu cầu 5 giao dịch gần đây
        if (type === 'recent') {
            const recentTransactions = await PaymentActivity.find({
                status: "success",
                type: "bank"
            })
                .sort({ createAt: -1 })
                .limit(6);

            return NextResponse.json({
                success: true,
                data: recentTransactions
            });
        }

        // Lấy thống kê tổng (không cần lọc theo thời gian)
        const overallStats = await PaymentActivity.aggregate([
            {
                $match: {
                    status: "success",
                    type: "bank"
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalTransactions: { $sum: 1 },
                    totalTokens: { $sum: "$tokensEarned" }
                }
            }
        ]);

        const matchCondition: Filter = {
            status: "success",
            type: "bank"
        };

        if (startDate && endDate) {
            matchCondition.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        } else if (year) {
            const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
            const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);
            matchCondition.createdAt = {
                $gte: yearStart,
                $lte: yearEnd
            };
        }

        const monthlyResults = await PaymentActivity.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    amount: { $sum: "$amount" },
                    tokens: { $sum: "$tokensEarned" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const monthlyData = monthlyResults.map(item => ({
            month: months[item._id - 1],
            amount: item.amount,
            tokens: item.tokens,
            count: item.count
        }));

        return NextResponse.json({
            success: true,
            data: {
                stats: overallStats[0] || { totalAmount: 0, totalTransactions: 0, totalTokens: 0 },
                monthlyData
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu giao dịch:', error);
        return NextResponse.json(
            { success: false, error: 'Đã xảy ra lỗi khi truy vấn dữ liệu' },
            { status: 500 }
        );
    }
}