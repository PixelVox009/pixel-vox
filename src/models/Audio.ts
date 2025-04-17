
import mongoose, { Schema, Types, model, models } from 'mongoose';
const AudioSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    content: {
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
    progress: {
      type: Number,
      default: 0,
    },
    totalSegments: {
      type: Number,
      default: 0,
    },
    completedSegments: {
      type: Number,
      default: 0,
    },
    segments: [{ type: Types.ObjectId, ref: "Segment" }],
    audioLink: { type: String },
  },
  { timestamps: true }
);

export const Audio = models.Audio || model("Audio", AudioSchema);
