// src/middleware.ts
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    console.log("Middleware - Path:", path);
    console.log("Middleware - Token:", request.cookies.get("auth_token")?.value);
    const isPublicPath = path === "/login" || path === "/register" || path === "/";

    const token = request.cookies.get("auth_token")?.value || "";

    let isValidToken = false;

    if (token) {
        try {
            jwt.verify(token, JWT_SECRET);
            isValidToken = true;
        } catch (error) {
            isValidToken = false;
        }
    }
    if (isPublicPath && isValidToken) {
        console.log("Chuyển hướng từ trang công khai đến dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!isPublicPath && !isValidToken) {
        console.log("Chuyển hướng đến trang đăng nhập");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("Cho phép truy cập bình thường");
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        // "/dashboard/:path*",
        // "/profile/:path*"
    ]
};