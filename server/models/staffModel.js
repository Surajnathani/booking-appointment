import mongoose, { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Full Time", "Part Time"],
    },
    staffOwnerId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Staff = mongoose.models.staff || model("staff", schema);
