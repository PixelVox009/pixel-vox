import { NextResponse } from "next/server";

import Setting from "@/models/seting";
import dbConnect from "@/lib/db";

export async function GET() {
    try {
        await dbConnect();

        const settings = await Setting.find({
            key: { $in: ["usdToTokenRate", "vndToUsdRate"] },
        }).select("key value").lean();

        // Giá trị mặc định
        let usdToTokenRate = 10; // 1 USD = 10 tokens
        let vndToUsdRate = 25000; // 25,000 VND = 1 USD

        // Nếu có cài đặt trong database thì sử dụng
        const usdToTokenSetting = settings.find(s => s.key === "usdToTokenRate");
        const vndToUsdSetting = settings.find(s => s.key === "vndToUsdRate");

        if (usdToTokenSetting && usdToTokenSetting.value) {
            usdToTokenRate = Number(usdToTokenSetting.value);
        }

        if (vndToUsdSetting && vndToUsdSetting.value) {
            vndToUsdRate = Number(vndToUsdSetting.value);
        }

        return NextResponse.json({ usdToTokenRate, vndToUsdRate });
    } catch (error) {
        console.error("Lỗi khi lấy tỷ giá:", error);
        return NextResponse.json(
            { error: "Không thể lấy thông tin tỷ giá", usdToTokenRate: 10, vndToUsdRate: 25000 },
            { status: 500 }
        );
    }
}