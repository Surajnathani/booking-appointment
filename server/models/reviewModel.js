import mongoose, { Schema, model, Types } from "mongoose";

const schema = new Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    senderId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.models.Review || model("Review", schema);
