import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import Wallet from "@/models/wallet";
import bcrypt, { compare } from "bcryptjs";
import { Error } from "mongoose";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Vui lòng cung cấp email và mật khẩu");
                }
                try {
                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email }).select("+password");

                    if (!user) {
                        throw new Error("Email hoặc mật khẩu không chính xác");
                    }
                    const isPasswordCorrect = await compare(credentials.password, user.hashedPassword);

                    if (!isPasswordCorrect) {
                        throw new Error("Email hoặc mật khẩu không chính xác");
                    }
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        throw new Error(error.message || "Đăng nhập thất bại, vui lòng thử lại sau");
                    } else {
                        throw new Error("Đăng nhập thất bại, vui lòng thử lại sau");
                    }
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            try {
                await dbConnect();
                if (account?.provider === "google" && profile?.email) {
                    const existingUser = await User.findOne({ email: profile.email });
                    const password = await bcrypt.hash("12345678", 10);
                    const payment = Math.floor(100000 + Math.random() * 900000).toString()
                    if (!existingUser) {
                        const newUser = new User({
                            email: profile.email,
                            name: profile.name || 'Google User',
                            image: profile.image ?? '',
                            role: "user",
                            hashedPassword: password,
                            paymentCode: payment,

                        });
                        await newUser.save();
                        await Wallet.create({
                            customer: newUser._id,
                            balance: 50,
                            totalRecharged: 0,
                            totalTokens: 50
                        });
                        if (user) {
                            user.id = newUser._id.toString();
                            user.role = "user";
                        }
                    } else {
                        if (user) {
                            user.id = existingUser._id.toString();
                            user.role = existingUser.role;
                        }
                    }
                }
                return true;
            } catch (error) {
                console.error("Lỗi khi xử lý đăng nhập:", error);
                return false;
            }
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

