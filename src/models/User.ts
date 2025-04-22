import mongoose, { Schema, Types, models } from 'mongoose';
export interface IUser {
    _id: string | Types.ObjectId;
    name: string;
    email: string;
    hashedPassword?: string;
    image: string;
    role: 'user' | 'admin';
    tokenBalance: number;
    lastLoginAt: Date | null;
    paymentCode: string;
    hasPassword?: boolean;

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
        required: false,
    },
    image: {
        type: String,
        default: "",
    },
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
    provider: {
        type: String,
        enum: ["credentials", "google", ""],
        default: "credentials",
    }
}, { timestamps: true });

export const User = models.User || mongoose.model<IUser>('User', UserSchema);
