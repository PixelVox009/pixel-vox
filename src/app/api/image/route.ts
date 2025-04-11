import dbConnect from "@/lib/db";
import { Image } from "@/models/Image";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "asc",
  } = Object.fromEntries([...searchParams]);

  try {
    await dbConnect();
    const skip = (+page - 1) * +limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const images = await Image.find()
      .skip(skip)
      // .limit(+limit)
      .sort({ [sortBy]: sortOrder });

    const totalImages = await Image.countDocuments();
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
