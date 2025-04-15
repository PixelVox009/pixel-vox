import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Vui lòng định nghĩa MONGODB_URI trong file .env');
}

// Khai báo cached như một biến module thay vì sử dụng global
const cached: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
} = { conn: null, promise: null };

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log('MongoDB connected successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('Lỗi kết nối MongoDB:', e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;