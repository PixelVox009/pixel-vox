import axios from "axios";
import Joi from "joi";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { Audio } from "@/models/Audio";
import { Segment } from "@/models/Segment";
import { autoSplitStory } from "@/utils/splitStory";
import { authOptions } from "../../auth/[...nextauth]/route";
import Setting from "@/models/seting";

const schema = Joi.object({
  textContent: Joi.string().required(),
  voice: Joi.string().required(),
});

// [POST] /api/audio/generate
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
    const server = await Setting.find({
      key: { $in: ["AUDIO_SERVER_KEY", "AUDIO_SERVER_URL"] }
    })
    const serverSettings: { [key: string]: string } = {};
    server.forEach(setting => {
      serverSettings[setting.key] = setting.value;
    });
    const title = value.textContent.split(" ").slice(0, 8).join(" ").trim();
    
    const contentSegments = autoSplitStory(value.textContent);
    const segmentList = [];
    for (let i = 0; i < contentSegments.length; i++) {
      const { data: resData } = await axios.post(
        `${serverSettings.AUDIO_SERVER_URL}/tool-service-api/create-audio-customer`,
        {
          textContent: contentSegments[i],
          segmentIndex: i + 1,
          orderId,
          voice: value.voice,
        },
        {
          headers: {
            Authorization: "Bearer " + serverSettings.AUDIO_SERVER_KEY,
          },
        }
      );
      const audioService = resData.data;

      segmentList.push({
        serviceId: audioService.serviceId,
        segmentIndex: i + 1,
        contentLength: contentSegments[i].length,
        orderId: orderId,
      });
    }
    const segments = await Segment.create(segmentList);

    // Create audio
    const audio = await Audio.create({
      userId,
      content : value.textContent,
      title,
      orderId,
      segments: segments.map((segment) => segment._id),
      totalSegments: segments.length,
    });

    return NextResponse.json(
      {
        statusCode: 201,
        message: "Audio created successfully",
        data: audio,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
