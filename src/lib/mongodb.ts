import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-generator';
if (!MONGODB_URI) {
    throw new Error('Vui lòng định nghĩa biến môi trường MONGODB_URI');
}
declare global {
    let mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
    const mongoClientPromise: Promise<MongoClient> | undefined;
}
const globalWithMongoose = global as typeof globalThis & {
    mongoose?: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
    mongoClientPromise?: Promise<MongoClient>;
};
// --- Mongoose connection (ODM)
if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = { conn: null, promise: null };
}
const mongooseCache = globalWithMongoose.mongoose;
export async function connectMongoose() {
    if (mongooseCache.conn) return mongooseCache.conn;

    if (!mongooseCache.promise) {
        mongooseCache.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        mongooseCache.conn = await mongooseCache.promise;
    } catch (e) {
        mongooseCache.promise = null;
        throw e;
    }

    return mongooseCache.conn;
}

// --- MongoClient for NextAuth Adapter
const mongoClient =
    globalWithMongoose.mongoClientPromise || new MongoClient(MONGODB_URI);

if (mongoClient instanceof MongoClient) {
    const mongoClientPromise = mongoClient.connect();
    globalWithMongoose.mongoClientPromise = mongoClientPromise;
} else {
    globalWithMongoose.mongoClientPromise = mongoClient;
}

export default globalWithMongoose.mongoClientPromise;
