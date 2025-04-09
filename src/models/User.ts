import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;