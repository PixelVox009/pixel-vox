import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Kiểm tra đặc biệt cho API session để tránh vòng lặp
    if (pathname.startsWith('/api/auth/session')) {
        // Thêm cache headers
        const response = NextResponse.next();
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
        return response;
    }

    // Chỉ gọi getToken cho các route không phải API session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    // Các route cần bảo vệ
    const adminRoutes = ['/dashboard', '/admin'];
    const userRoutes = ['/audio', '/video', '/image'];
    const authRoutes = ['/login', '/register', '/forgot-password'];

    if (adminRoutes.some(route => pathname.startsWith(route)) && token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/audio', req.url));
    }
    if (userRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
        if (token.role === 'admin') {
            return NextResponse.redirect(new URL('admin/dashboard', req.url));
        } else {
            return NextResponse.redirect(new URL('/audio', req.url));
        }
    }
    const response = NextResponse.next();
    response.headers.set(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
    );
    return response;
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