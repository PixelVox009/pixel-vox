import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { User } from '@/models/User';
import dbConnect from '@/lib/db';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;
        console.log("🚀 ~ POST ~ body:", body)

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Vui lòng nhập đầy đủ thông tin' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email đã được sử dụng' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🚀 ~ POST ~ hashedPassword:", hashedPassword)

        // Create user
        const user = await User.create({
            name,
            email,
            hashedPassword,
            tokenBalance: 10, 
        });

        return NextResponse.json(
            { message: 'Đăng ký thành công', user: { id: user._id, name: user.name, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Đã xảy ra lỗi khi đăng ký' },
            { status: 500 }
        );
    }
}