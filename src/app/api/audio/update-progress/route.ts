import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import dbConnect from "@/lib/db";
import { Audio } from "@/models/Audio";
import { Segment } from "@/models/Segment";
import { ISegment } from "@/models/Segment";

const schema = Joi.object({
  orderId: Joi.string().required(),
  serviceId: Joi.string().required(),
  link: Joi.string().required(),
});

// [PUT] /api/audio/update-progress
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

    const updatedSegment = await Segment.findOneAndUpdate(
      {
        orderId: value.orderId,
        serviceId: value.serviceId,
        link: { $exists: false },
      },
      { $set: { link: value.link } }
    );

    if (!updatedSegment) {
      return NextResponse.json({
        statusCode: 400,
        message: "Segment not found",
      });
    }

    const audio = await Audio.findOne({
      orderId: value.orderId,
      segments: { $in: updatedSegment._id },
    }).populate("segments");

    if (!audio) {
      return NextResponse.json(
        { statusCode: 400, message: "Audio not found" },
        { status: 400 }
      );
    }

    audio.completedSegments++;

    audio.progress = Math.round(
      (audio.completedSegments / audio.totalSegments) * 100
    );
    audio.status = audio.progress === 100 ? "success" : "processing";

    if (audio.progress === 100) {
      const segments = audio.segments;
      segments.sort((a: ISegment, b: ISegment) => a.segmentIndex - b.segmentIndex);

      const audioLinks = segments.map((segment: ISegment) => segment.link);
      const { data: resData } = await axios.post(
        `${process.env.AUDIO_SERVER_URL}/tool-service-api/create-audio-merge`,
        {
          audioLinks: audioLinks,
        },
        {
          headers: {
            Authorization: "Bearer " + process.env.AUDIO_SERVER_KEY,
          },
        }
      );

      audio.audioLink = resData.data.audioLink;
    }

    await audio.save();

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Audio updated successfully",
        data: audio,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
