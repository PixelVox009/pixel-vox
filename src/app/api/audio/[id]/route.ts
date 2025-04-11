import dbConnect from "@/lib/db";
import { Audio } from "@/models/Audio";
import { Segment } from "@/models/Segment";
import { NextRequest, NextResponse } from "next/server";

// [DELETE] /api/audio/{id}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    await dbConnect();

    const audio = await Audio.findById(id);
    if (!audio) {
      return NextResponse.json(
        {
          statusCode: 404,
          message: "Audio không tồn tại!",
        },
        { status: 404 }
      );
    }

    const deleted = await Audio.deleteOne({ _id: id });

    if (deleted.deletedCount) {
      await Segment.deleteMany({ orderId: audio.orderId });
    }

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Xóa thành công",
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Lỗi trong API:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
