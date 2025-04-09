import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixel-vox';

if (!MONGODB_URI) {
    throw new Error('Vui lòng định nghĩa biến môi trường MONGODB_URI');
}

// Khai báo biến global để sử dụng cache
declare global {
    var mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
    };
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose.connection;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;