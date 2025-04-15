import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import dbConnect from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";
import Wallet from "@/models/wallet";
import PaymentActivity from "@/models/payment-activity";

// [POST] /api/user/use-token
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { tokenNumber } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const wallet = await Wallet.findOne({ customer: session.user.id });
    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    const oldBalance = wallet.balance;
    const newBalance = oldBalance - tokenNumber;

    // them ban ghi payment activities voi type = spend
    const paymentActivity = await PaymentActivity.create({
      transaction: "SPEND" + new Date().getTime(),
      oldBalance: wallet.balance,
      newBalance: newBalance,
      customer: session.user.id,
      wallet: wallet._id,
      amount: 0,
      type: "spend",
      status: "success",
      description: `Bạn đã tiêu ${tokenNumber} tokens`,
      tokensEarned: tokenNumber,
    });

    // Cập nhật ví của người dùng
    await Wallet.updateOne(
      {
        _id: wallet._id,
      },
      {
        balance: newBalance,
        totalTokens: newBalance,

        $inc: {
          totalSpent: tokenNumber,
        },
      }
    );

    // sua lai message
    return NextResponse.json(
      {
        statusCode: 200,
        message: "Audio created successfully",
        data: paymentActivity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
