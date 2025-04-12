import dbConnect from "@/lib/db";
import { Image } from "@/models/Image";
import { NextRequest, NextResponse } from "next/server";

// [DELETE] /api/image/{id}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    await dbConnect();

    const image = await Image.findById(id);
    if (!image) {
      return NextResponse.json(
        {
          statusCode: 404,
          message: "Image không tồn tại!",
        },
        { status: 404 }
      );
    }

    const deleted = await Image.deleteOne({ _id: id });

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
