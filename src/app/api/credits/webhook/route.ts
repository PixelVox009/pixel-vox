import { NextRequest, NextResponse } from "next/server";
import { processWebhookData, validateAccessToken } from "./webhook.service";


export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        console.log("🚀 ~ POST ~ authHeader:", authHeader)
        const bearerToken = authHeader?.split(" ")[1];
        console.log("🚀 ~ POST ~ bearerToken:", bearerToken)
        if (!bearerToken) {
            console.log("Access Token không được cung cấp hoặc không hợp lệ.");
            return NextResponse.json({ status: true, msg: "OK" }, { status: 200 });
        }
        const isValidToken = await validateAccessToken(bearerToken);
        if (!isValidToken) {
            console.log("Access Token xác thực thất bại, không thể nạp tiền");
            return NextResponse.json({ status: true, msg: "OK" }, { status: 200 });
        }
        const body = await req.json();
        const data = body.data;
        await processWebhookData(data);
        console.log("Web2m successful deposit");
        return NextResponse.json({ status: true, msg: "OK" }, { status: 200 });
    } catch (error) {
        console.error("Lỗi xử lý webhook:", error);
        return NextResponse.json({ status: true, msg: "OK" }, { status: 200 });
    }
}