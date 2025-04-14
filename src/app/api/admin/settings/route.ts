import dbConnect from '@/lib/db';
import Setting from '@/models/seting';
import { NextResponse } from 'next/server';


// Lấy thông tin cài đặt tỉ giá
export async function GET() {
    try {
        await dbConnect();

        const settings = await Setting.find({
            key: { $in: ['usdToTokenRate', 'vndToUsdRate'] }
        });

        // Chuyển đổi mảng thành object
        const settingsObj: Record<string, string> = {};
        settings.forEach(setting => {
            settingsObj[setting.key] = setting.value;
        });

        return NextResponse.json({
            success: true,
            data: settingsObj
        });
    } catch (error) {
        console.error('Lỗi khi lấy cài đặt:', error);
        return NextResponse.json(
            { success: false, error: 'Đã xảy ra lỗi khi lấy cài đặt' },
            { status: 500 }
        );
    }
}

// Cập nhật cài đặt tỉ giá
export async function PUT(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { usdToTokenRate, vndToUsdRate } = body;

        if (!usdToTokenRate && !vndToUsdRate) {
            return NextResponse.json(
                { success: false, error: 'Cần cung cấp ít nhất một tỉ giá' },
                { status: 400 }
            );
        }

        // Cập nhật từng tỉ giá
        if (usdToTokenRate !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'usdToTokenRate' },
                { value: parseInt(usdToTokenRate) },
                { upsert: true, new: true }
            );
        }

        if (vndToUsdRate !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'vndToUsdRate' },
                { value: parseInt(vndToUsdRate) },
                { upsert: true, new: true }
            );
        }

        // Lấy dữ liệu đã cập nhật
        const updatedSettings = await Setting.find({
            key: { $in: ['usdToTokenRate', 'vndToUsdRate'] }
        });

        const result: Record<string, string> = {};
        updatedSettings.forEach(setting => {
            result[setting.key] = setting.value;
        });

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật cài đặt:', error);
        return NextResponse.json(
            { success: false, error: 'Đã xảy ra lỗi khi cập nhật cài đặt' },
            { status: 500 }
        );
    }
}