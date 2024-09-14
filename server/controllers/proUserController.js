import { Appointment } from "../models/appointmentModel.js";
import { ProUser } from "../models/proUserModel.js";
import { Review } from "../models/reviewModel.js";
import { User } from "../models/userModel.js";

import {
  cookieOptions,
  deleteFileToCloudinary,
  sendToken,
  uploadFileToCloudinary,
} from "../utils/features.js";

const proUserSignUp = async (req, res) => {
  try {
    const {
      centerName,
      name,
      email,
      password,
      phone,
      gender,
      website,
      startWeek,
      endWeek,
      startTime,
      endTime,
      googleMapLink,
      category,
      numberOfAppointments,
      services,
      address,
      city,
      state,
      pinCode,
      country,
    } = req.body;

    const file = req.file;

    if (!file)
      return res.status(400).json({
        success: false,
        message: "Please upload image",
      });

    const exist = await ProUser.findOne({
      $or: [{ email }, { phone }],
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const result = await uploadFileToCloudinary([file]);
    const image = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const user = await ProUser.create({
      centerName,
      name,
      email,
      password,
      phone,
      gender,
      website,
      startWeek,
      endWeek,
      startTime,
      endTime,
      googleMapLink,
      category,
      numberOfAppointments,
      image,
      services,
      address,
      city,
      state,
      pinCode,
      country,
    });
    sendToken(res, user, 201, "Clinic created successfully");
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in sign in API", error });
  }
};

const profile = async (req, res) => {
  try {
    let user = await ProUser.findById(req.user);

    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    return res.status(201).json({ success: true, user });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getting user profile",
      error,
    });
  }
};

const getAllProfile = async (req, res) => {
  try {
    const userId = req.user;

    const [normalUser, proUser] = await Promise.all([
      User.findById(userId),
      ProUser.findById(userId),
    ]);

    const user = normalUser || proUser;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userCity = user.city.toLowerCase();
    const userState = user.state.toLowerCase();
    const userAddressWords = user.address.toLowerCase().split(" ");

    const { category, rating } = req.query;
    const filter = {};

    if (category) filter.category = category;

    const parsedRating = rating ? parseFloat(rating) : null;

    const profiles = await ProUser.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "receiverId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0,
            },
          },
          addressMatchScore: {
            $sum: userAddressWords.map((word) => ({
              $cond: [
                {
                  $regexMatch: { input: { $toLower: "$address" }, regex: word },
                },
                1,
                0,
              ],
            })),
          },
          cityMatch: { $eq: [{ $toLower: "$city" }, userCity] },
          stateMatch: { $eq: [{ $toLower: "$state" }, userState] },
        },
      },
      {
        $match: {
          ...filter,
          ...(parsedRating !== null
            ? { avgRating: { $gte: parsedRating } }
            : {}),
        },
      },
      { $sort: { addressMatchScore: -1, cityMatch: -1, stateMatch: -1 } },
      {
        $project: {
          password: 0,
          role: 0,
          cityMatch: 0,
          stateMatch: 0,
          addressMatchScore: 0,
          reviews: 0,
        },
      },
    ]);

    return res.status(201).json({
      success: true,
      profiles,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getting user profile",
      error,
    });
  }
};

const getSingleProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await ProUser.findById(userId);

    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    return res.status(201).json({ success: true, user });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getting user profile",
      error,
    });
  }
};

const searchProfile = async (req, res) => {
  try {
    const { centerName } = req.query;

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Name is required for searching",
      });
    }

    const proMember = await ProUser.aggregate([
      {
        $match: {
          centerName: { $regex: new RegExp(centerName, "i") },
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "receiverId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          password: 0,
          role: 0,
          reviews: 0,
        },
      },
    ]);

    return res.status(200).json({ success: true, proMember });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const proLogout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("appointment-token", "", { ...cookieOptions, maxAge: 0 })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Logout failed",
      error,
    });
  }
};

const updateProUser = async (req, res) => {
  try {
    const userId = req.user;
    const {
      centerName,
      name,
      phone,
      email,
      website,
      startWeek,
      endWeek,
      startTime,
      endTime,
      googleMapLink,
      category,
      numberOfAppointments,
      services,
      address,
      city,
      state,
      pinCode,
      country,
    } = req.body;

    const file = req.file;

    const user = await ProUser.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const emailExist = await ProUser.findOne({ email, _id: { $ne: userId } });

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const phoneExist = await ProUser.findOne({ phone, _id: { $ne: userId } });

    if (phoneExist) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const updates = {
      centerName: centerName || user.centerName,
      name: name || user.name,
      phone: phone || user.phone,
      email: email || user.email,
      website: website || user.website,
      startWeek: startWeek || user.startWeek,
      endWeek: endWeek || user.endWeek,
      startTime: startTime || user.startTime,
      endTime: endTime || user.endTime,
      googleMapLink: googleMapLink || user.googleMapLink,
      category: category || user.category,
      numberOfAppointments: numberOfAppointments || user.numberOfAppointments,
      services: services || user.services,
      address: address || user.address,
      city: city || user.city,
      state: state || user.state,
      pinCode: pinCode || user.pinCode,
      country: country || user.country,
    };

    let image = user.image;

    if (file) {
      await deleteFileToCloudinary(image.public_id);
      const result = await uploadFileToCloudinary([file]);
      image = {
        public_id: result[0].public_id,
        url: result[0].url,
      };
      updates.image = image;
    }

    const hasChanges = Object.keys(updates).some(
      (key) => updates[key] !== user[key]
    );

    if (!hasChanges) {
      return res.status(200).json({
        success: false,
        message: "No changes",
      });
    }

    Object.assign(user, updates);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in update API",
      error,
    });
  }
};

const deleteProUser = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    await Review.deleteMany({ receiverId: userId });

    await Appointment.deleteMany({ receiverId: userId });

    const user = await ProUser.findByIdAndDelete(userId);

    await deleteFileToCloudinary(user.image.public_id);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .cookie("appointment-token", "", { ...cookieOptions, maxAge: 0 })
      .json({
        success: true,
        message: "User deleted successfully",
      });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred while deleting the user",
      error,
    });
  }
};

export {
  deleteProUser,
  getAllProfile,
  getSingleProfile,
  profile,
  proLogout,
  proUserSignUp,
  searchProfile,
  updateProUser
};

