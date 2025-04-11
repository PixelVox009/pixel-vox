import mongoose, { Schema, model, models } from 'mongoose';
export interface IUser {
    name: string;
    email: string;
    hashedPassword: string;
    image: string;
    role: 'user' | 'admin';
    tokenBalance: number;
    lastLoginAt: Date | null;
    paymentCode: string;
}
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên'],
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
    },
    image: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    tokenBalance: {
        type: Number,
        default: 10,
    },
    lastLoginAt: {
        type: Date,
        default: null,
    },
    paymentCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
}, { timestamps: true });

export const User = models.User || mongoose.model<IUser>('User', UserSchema);
