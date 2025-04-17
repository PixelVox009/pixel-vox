import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "success", "failed"],
      default: "pending",
    },
    serviceId: {
      type: String,
      required: true,
    },
    imageLink: { type: String },
  },
  { timestamps: true }
);

export const Image = models.Image || model("Image", ImageSchema);
