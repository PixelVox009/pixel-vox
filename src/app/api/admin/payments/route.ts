import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import PaymentActivity from "@/models/payment-activity";

import { IUser, User } from "@/models/User";
import { isValidObjectId } from "mongoose";

interface Query {
    type?: string;
    status?: string;
    customer?: string;
    search?: string;
    $or?: Array<Record<string, unknown>>;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}

export async function GET(req: NextRequest) {
    try {
        // Kiểm tra quyền admin
        const session = await getServerSession(authOptions);
        if (!session?.user?.role || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Lấy query parameters
        const { searchParams } = new URL(req.url);

        // Parse pagination parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '25');
        const skip = (page - 1) * limit;

        // Parse filter parameters
        const type = searchParams.get('type');
        const search = searchParams.get('search');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const customer = searchParams.get('customer');
        const status = searchParams.get('status');

        // Kết nối database
        await dbConnect();

        // Build query
        const query: Query = {};

        // Add type filter
        if (type && type !== 'all') {
            query.type = type;
        }

        // Add status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add customer filter
        if (customer && isValidObjectId(customer)) {
            query.customer = customer;
        }

        // Add search filter
        if (search) {
            query.$or = [
                { description: { $regex: search, $options: 'i' } },
                { transaction: { $regex: search, $options: 'i' } }
            ];
        }

        // Add date range filter
        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                // Add 1 day to include the entire end date
                const endDateObj = new Date(endDate);
                endDateObj.setDate(endDateObj.getDate() + 1);
                query.createdAt.$lte = endDateObj;
            }
        }

        // Get total count for pagination
        const total = await PaymentActivity.countDocuments(query);

        // Get payment activities with pagination
        const activities = await PaymentActivity.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get user information for display
        const userIds = activities.map(activity => activity.customer).filter(Boolean);
        const users = await User.find({ _id: { $in: userIds } })
            .select('-hashedPassword')
            .lean<IUser[]>();

        const usersMap: Record<string, IUser> = users.reduce((map, user) => {
            if (user._id) {
                map[user._id.toString()] = user;
            }
            return map;
        }, {} as Record<string, IUser>);

        type ActivityWithUser = typeof activities[0] & { customerInfo?: IUser };

        const activitiesWithUser: ActivityWithUser[] = activities.map(activity => {
            const activityObj = { ...activity } as ActivityWithUser;
            const customerId = activity.customer?.toString();

            if (customerId && usersMap[customerId]) {
                activityObj.customerInfo = usersMap[customerId];
            }

            return activityObj;
        });

        return NextResponse.json({
            data: activitiesWithUser,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching payment activities:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({
            error: errorMessage
        }, { status: 500 });
    }
}

