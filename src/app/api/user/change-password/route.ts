import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Bạn chưa đăng nhập" }, { status: 401 });
        }
        const { currentPassword, newPassword } = await req.json();
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Vui lòng nhập đầy đủ thông tin" }, { status: 400 });
        }
        if (newPassword.length < 6) {
            return NextResponse.json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" }, { status: 400 });
        }
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ message: "Người dùng không tồn tại" }, { status: 404 });
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Mật khẩu hiện tại không chính xác" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne(
            { _id: user._id },
            { $set: { hashedPassword: hashedPassword } }
        );
        return NextResponse.json({ message: "Đổi mật khẩu thành công" }, { status: 200 });
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
        const errorMessage = error instanceof Error ? error.message : 'Lỗi server';
        return NextResponse.json({ message: `Đã xảy ra lỗi: ${errorMessage}` }, { status: 500 });
    }
}