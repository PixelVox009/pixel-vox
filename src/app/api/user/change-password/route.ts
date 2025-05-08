// app/api/user/change-password/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Bạn phải đăng nhập để thực hiện hành động này" },
                { status: 401 }
            );
        }
        await dbConnect();
        const { currentPassword, newPassword } = await req.json();
        const user = await User.findById(session.user.id).select("+hashedPassword");
        if (!user) {
            return NextResponse.json(
                { message: "Không tìm thấy người dùng" },
                { status: 404 }
            );
        }
        const hasPassword = session.user.hasPassword;
        if (hasPassword) {
            const isCorrectPassword = await bcrypt.compare(currentPassword, user.hashedPassword);
            if (!isCorrectPassword) {
                return NextResponse.json(
                    { message: "Mật khẩu hiện tại không chính xác" },
                    { status: 400 }
                );
            }
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.hashedPassword = hashedNewPassword;
        if (user.provider === "google") {
            user.provider = "credentials";
        }
        await user.save();
        return NextResponse.json({
            message: "Mật khẩu đã được cập nhật thành công"
        });
    } catch (error) {
        console.error("Lỗi thay đổi mật khẩu:", error);
        return NextResponse.json(
            { message: "Đã xảy ra lỗi khi cập nhật mật khẩu" },
            { status: 500 }
        );
    }
}