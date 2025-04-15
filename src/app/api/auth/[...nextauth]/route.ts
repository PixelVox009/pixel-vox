import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { compare } from "bcryptjs";
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

