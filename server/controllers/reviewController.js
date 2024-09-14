import mongoose from "mongoose";
import { Review } from "../models/reviewModel.js";
import { Appointment } from "../models/appointmentModel.js";

const postReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const userId = req.user;
    const proUserId = req.params.id;

    if (userId === proUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot review your own profile",
      });
    }

    const hasCompletedAppointment = await Appointment.findOne({
      senderId: userId,
      receiverId: proUserId,
      status: "Completed",
    });

    if (!hasCompletedAppointment) {
      return res.status(403).json({
        success: false,
        message: "Book an appointment first!",
      });
    }

    const reviewData = await Review.create({
      review,
      rating,
      senderId: userId,
      receiverId: proUserId,
    });

    return res.status(200).json({
      success: true,
      message: "Review created successfully",
      reviewData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in Review api" });
  }
};

const getReview = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const [reviews, totalReviews, totalRatings, totalStarsGroup] =
      await Promise.all([
        Review.find({ receiverId: userId })
          .populate("senderId", "name avatar -_id")
          .sort({ createdAt: -1 }),

        Review.countDocuments({ receiverId: userId }),

        Review.aggregate([
          { $match: { receiverId: userId } },
          { $group: { _id: null, totalRating: { $avg: "$rating" } } },
        ]),

        Review.aggregate([
          { $match: { receiverId: userId } },
          { $group: { _id: "$rating", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
        ]),
      ]);

    const totalRating = totalRatings[0]?.totalRating;

    const formattedTotalRating =
      totalRating !== null && totalRating !== undefined
        ? totalRating.toFixed(2)
        : "0.00";

    const starGroups = [5, 4, 3, 2, 1].map((star) => {
      const found = totalStarsGroup.find((group) => group._id === star);
      return { star, count: found ? found.count : 0 };
    });

    const stats = {
      reviews,
      totalReviews,
      totalRatings: formattedTotalRating,
      totalStarsGroup: starGroups,
    };

    return res.status(200).json({
      success: true,
      message: "Rating Stats",
      stats,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in Review api" });
  }
};

const deleteReview = async (req, res) => {
  try {
    const userId = req.user;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.receiverId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in Review api" });
  }
};

export { deleteReview, getReview, postReview };
