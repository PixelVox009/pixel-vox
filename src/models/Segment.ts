import { Schema, model, models } from "mongoose";

const SegmentSchema = new Schema(
  {
    serviceId: {
      type: String,
      required: true,
    },
    segmentIndex: {
      type: Number,
      required: true,
    },
    orderId: { type: String, required: true },
    link: { type: String },
  },
  { timestamps: true }
);

export const Segment = models.Segment || model("Segment", SegmentSchema);
