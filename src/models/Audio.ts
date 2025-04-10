import { Schema, model, models } from "mongoose";

const AudioSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "success", "failed"],
      default: "pending",
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Audio = models.Audio || model("Audio", AudioSchema);
