
import clientPromise from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import dbConnect from "@/lib/db";
export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Vui lòng nhập email và mật khẩu");
                }

                await dbConnect();

                // Tìm user bằng email
                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.hashedPassword) {
                    throw new Error("Email hoặc mật khẩu không chính xác");
                }

                // So sánh password
                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!passwordMatch) {
                    throw new Error("Email hoặc mật khẩu không chính xác");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            if (account && account.access_token) {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }

            return session;
        },
    },
    events: {
        async signIn({ user }) {
            // Thêm 10 token miễn phí cho người dùng đăng ký mới
            if (user) {
                await dbConnect();
                const existingUser = await User.findById(user.id);

                // Đánh dấu đã đăng nhập
                await User.findByIdAndUpdate(user.id, {
                    $set: {
                        lastLoginAt: new Date(),
                    },
                });
            }
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
