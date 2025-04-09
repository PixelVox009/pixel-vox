import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
    try {
        await dbConnect();

        // ✅ Không cần await ở cookies()
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Không tìm thấy token xác thực" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return NextResponse.json(
                { error: "Không tìm thấy người dùng" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                }
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        return NextResponse.json(
            { error: error.message || "Lỗi server" },
            { status: 500 }
        );
    }
}
