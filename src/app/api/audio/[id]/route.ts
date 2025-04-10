import dbConnect from "@/lib/db";
import { Audio } from "@/models/Audio";
import { NextRequest, NextResponse } from "next/server";

// [DELETE] /api/audio/{id}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    await dbConnect();

    const deleted = await Audio.deleteOne({ _id: id });

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
