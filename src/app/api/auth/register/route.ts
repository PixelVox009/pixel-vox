import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import Wallet from '@/models/wallet';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email đã được sử dụng' },
                { status: 400 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const paymentCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.create({
            name,
            email,
            paymentCode,
            hashedPassword,
            tokenBalance: 10,
        });
        await Wallet.create({
            customer: user._id,
            balance: 0,
            totalRecharged: 0,
            totalTokens: 0
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