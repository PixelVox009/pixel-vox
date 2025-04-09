import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json(
            { message: "Đăng xuất thành công" },
            { status: 200 }
        );
        response.cookies.delete("auth_token");

        return response;
    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
        return NextResponse.json(
            { error: "Lỗi server" },
            { status: 500 }
        );
    }
}
