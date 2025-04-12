import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!token;

    // Các route cần bảo vệ
    const adminRoutes = ['/dashboard', '/admin'];
    const userRoutes = ['/audio', '/video', '/image'];
    const authRoutes = ['/login', '/register', '/forgot-password'];
    if (adminRoutes.some(route => pathname.startsWith(route)) && token?.role !== 'admin') {
        console.log("Redirecting non-admin from admin route");
        return NextResponse.redirect(new URL('/audio', req.url));
    }
    if (userRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
        if (token.role === 'admin') {
            console.log("Redirecting admin to dashboard");
            return NextResponse.redirect(new URL('admin/dashboard', req.url));
        } else {
            return NextResponse.redirect(new URL('/audio', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/audio/:path*',
        '/video/:path*',
        '/image/:path*',
        '/login',
        '/register',
        '/forgot-password',
    ],
};