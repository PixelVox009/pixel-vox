import dbConnect from '@/lib/db';
import Setting from '@/models/seting';
import { NextResponse } from 'next/server';

// Lấy thông tin cài đặt tỉ giá
export async function GET() {
    try {
        await dbConnect();

        const settings = await Setting.find();

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

// Cập nhật cài đặt tỉ giá và cấu hình server
export async function PUT(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const {
            usdToTokenRate,
            vndToUsdRate,
            imageToTokenRate,
            minuteToTokenRate,
            AUDIO_SERVER_URL,
            AUDIO_SERVER_KEY,
            IMAGE_SERVER_URL,
            IMAGE_SERVER_KEY
        } = body;

        // Kiểm tra nếu không có dữ liệu nào được cung cấp
        if (!usdToTokenRate && !vndToUsdRate && !imageToTokenRate && !minuteToTokenRate
            && !AUDIO_SERVER_URL && !AUDIO_SERVER_KEY && !IMAGE_SERVER_URL && !IMAGE_SERVER_KEY) {
            return NextResponse.json(
                { success: false, error: 'Cần cung cấp ít nhất một thông số để cập nhật' },
                { status: 400 }
            );
        }

        // Cập nhật từng tỉ giá
        if (usdToTokenRate !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'usdToTokenRate' },
                { value: usdToTokenRate.toString() },
                { upsert: true, new: true }
            );
        }

        if (vndToUsdRate !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'vndToUsdRate' },
                { value: vndToUsdRate.toString() },
                { upsert: true, new: true }
            );
        }

        // Cập nhật tỉ giá token cho hình ảnh và phút
        if (imageToTokenRate !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'imageToTokenRate' },
                { value: imageToTokenRate.toString() },
                { upsert: true, new: true }
            );
        }

        if (minuteToTokenRate !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'minuteToTokenRate' },
                { value: minuteToTokenRate.toString() },
                { upsert: true, new: true }
            );
        }
        if (AUDIO_SERVER_URL !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'AUDIO_SERVER_URL' },
                { value: AUDIO_SERVER_URL },
                { upsert: true, new: true }
            );
        }

        if (AUDIO_SERVER_KEY !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'AUDIO_SERVER_KEY' },
                { value: AUDIO_SERVER_KEY },
                { upsert: true, new: true }
            );
        }
        // Cập nhật cấu hình Image Server
        if (IMAGE_SERVER_URL !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'IMAGE_SERVER_URL' },
                { value: IMAGE_SERVER_URL },
                { upsert: true, new: true }
            );
        }

        if (IMAGE_SERVER_KEY !== undefined) {
            await Setting.findOneAndUpdate(
                { key: 'IMAGE_SERVER_KEY' },
                { value: IMAGE_SERVER_KEY },
                { upsert: true, new: true }
            );
        }
        // Đợi tất cả các thao tác cập nhật hoàn tất
        await new Promise(resolve => setTimeout(resolve, 100));

        // Lấy dữ liệu đã cập nhật
        const updatedSettings = await Setting.find();

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