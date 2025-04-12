import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-generator';
if (!MONGODB_URI) {
    throw new Error('Vui lòng định nghĩa biến môi trường MONGODB_URI');
}
declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
    var mongoClientPromise: Promise<MongoClient> | undefined;
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
let mongoClient: MongoClient;
let mongoClientPromise: Promise<MongoClient>;

if (!globalWithMongoose.mongoClientPromise) {
    mongoClient = new MongoClient(MONGODB_URI);
    globalWithMongoose.mongoClientPromise = mongoClient.connect();
}
mongoClientPromise = globalWithMongoose.mongoClientPromise;

export default mongoClientPromise;
