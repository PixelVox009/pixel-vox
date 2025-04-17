import { NextRequest, NextResponse } from "next/server";
import { processWebhookData, validateAccessToken } from "./webhook.service";


export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        const bearerToken = authHeader?.split(" ")[1];
        if (!bearerToken) {
            return NextResponse.json({ status: true, msg: "OK" }, { status: 200 });
        }
        const isValidToken = await validateAccessToken(bearerToken);
        if (!isValidToken) {
            return NextResponse.json({ status: true, msg: "OK" }, { status: 200 });
        }
        const body = await req.json();
        const data = body.data;
        await processWebhookData(data);
        return NextResponse.json({ status: true, msg: "OK" }, { status: 200 });
    } catch (error) {
        console.error("Lỗi xử lý webhook:", error);
        return NextResponse.json({ status: true, msg: "OK" }, { status: 200 });
    }
}