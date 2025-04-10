import mongoose, { Schema, model, models } from 'mongoose';

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
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);
