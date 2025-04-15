import { NextRequest, NextResponse } from "next/server";
import Setting from "@/models/seting";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { key } = Object.fromEntries([...searchParams]);

    if (!key) {
      return NextResponse.json(
        { message: "Thiếu tham số 'key'." },
        { status: 400 }
      );
    }

    const settings = await Setting.find({ key: { $in: key.split(",") } });

    if (!settings) {
      return NextResponse.json(
        { message: "Không tìm thấy key này." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Ok",
        data: settings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
