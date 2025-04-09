import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Vui lòng nhập email và mật khẩu" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "Email hoặc mật khẩu không đúng" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Email hoặc mật khẩu không đúng" },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ Ghi cookie bằng NextResponse
        const response = NextResponse.json({
            message: "Đăng nhập thành công",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 86400,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return response;
    } catch (error: any) {
        console.error("Lỗi đăng nhập:", error);
        return NextResponse.json(
            { error: error.message || "Lỗi server" },
            { status: 500 }
        );
    }
}
