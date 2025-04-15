import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";

import dbConnect from "@/lib/db";
import { Audio } from "@/models/Audio";

const schema = Joi.object({
  title: Joi.string().required(),
  status: Joi.string()
    .valid("pending", "processing", "success", "failed")
    .default("pending"),

  progress: Joi.number().min(0).max(100).default(0),
});

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

    const audios = await Audio.find()
      .skip(skip)
      // .limit(+limit)
      .sort({ [sortBy]: sortOrder });

    const totalAudios = await Audio.countDocuments();
    const totalPages = Math.ceil(totalAudios / +limit);

    return NextResponse.json(
      {
        statusCode: 200,
        message: "OK",
        data: {
          docs: audios,
          page: +page,
          totalPages,
          total: totalAudios,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Đã xảy ra lỗi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { error, value } = schema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return NextResponse.json(
        { error: error.details.map((e: Joi.ValidationErrorItem) => e.message) },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create audio
    const audio = await Audio.create(value);

    return NextResponse.json(
      {
        message: "Tạo audio thành công",
        data: audio,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Đã xảy ra lỗi" }, { status: 500 });
  }
}
