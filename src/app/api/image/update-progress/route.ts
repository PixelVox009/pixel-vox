import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Image } from "@/models/Image";

const schema = Joi.object({
  orderId: Joi.string().required(),
  serviceId: Joi.string().required(),
  link: Joi.string().required(),
});

// [PUT] /api/image/update-progress
export async function PUT(req: NextRequest) {
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

    const image = await Image.findOneAndUpdate(
      {
        orderId: value.orderId,
        serviceId: value.serviceId,
      },
      {
        imageLink: value.link,
        status: "success",
      }
    );

    if (!image) {
      return NextResponse.json(
        { statusCode: 400, message: "Image not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Image updated successfully",
        data: image,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
