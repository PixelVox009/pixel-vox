import Joi from "joi";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import dbConnect from "@/lib/db";
import { Image } from "@/models/Image";
import { autoSplitStory } from "@/utils/splitStory";
import { authOptions } from "../../auth/[...nextauth]/route";

const schema = Joi.object({
  title: Joi.string().required(),
  textContent: Joi.string().required(),
});

// [POST] /api/image/generate
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { error, value } = schema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return NextResponse.json(
        { error: error.details.map((e: Joi.ValidationErrorItem) => e.message) },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Vui lòng đăng nhập để thực hiện chức năng này" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    const orderId = new Date().getTime();
    const contentSegments = autoSplitStory(value.textContent);

    const { data: resData } = await axios.post(
      `${process.env.IMAGE_SERVER_URL}/tool-service-api/create-image-by-customer`,
      {
        thumbnailsText: contentSegments,
        orderId,
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.IMAGE_SERVER_KEY,
        },
      }
    );
    const imageService = resData.data;

    // Create Image
    const image = await Image.create({
      userId,
      title: value.title,
      orderId,
      serviceId: imageService.serviceId,
    });

    return NextResponse.json(
      {
        statusCode: 201,
        message: "Image created successfully",
        data: image,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
