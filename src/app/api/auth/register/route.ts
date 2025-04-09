import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Vui lòng điền đầy đủ thông tin" },
                { status: 400 }
            );
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email đã được sử dụng" },
                { status: 400 }
            );
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            {
                message: "Đăng ký thành công",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                }
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Lỗi đăng ký:", error);
        return NextResponse.json(
            { error: error.message || "Lỗi server" },
            { status: 500 }
        );
    }
}