import mongoose, { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    service: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    charge: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "ProUser",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Cancelled", "Ongoing", "Rejected", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Appointment =
  mongoose.models.Appointment || model("Appointment", schema);
