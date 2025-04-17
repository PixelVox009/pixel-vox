import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Image } from "@/models/Image";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = Object.fromEntries([...searchParams]);

  try {
    await dbConnect();

    // Lấy thông tin người dùng đang đăng nhập từ session
    const session = await getServerSession(authOptions);

    // Kiểm tra đăng nhập
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập để xem danh sách audio" },
        { status: 401 }
      );
    }

    // Lấy userId từ session
    const userId = session.user.id;

    const skip = (+page - 1) * +limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const images = await Image.find({ userId: userId })
      .skip(skip)
      .limit(+limit)
      .sort({ [sortBy]: sortOrder });

    const totalImages = await Image.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalImages / +limit);

    return NextResponse.json(
      {
        statusCode: 200,
        message: "OK",
        data: {
          docs: images,
          page: +page,
          totalPages,
          total: totalImages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
