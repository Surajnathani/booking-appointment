import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import {
  cookieOptions,
  deleteFileToCloudinary,
  sendToken,
  uploadFileToCloudinary,
} from "../utils/features.js";
import { ProUser } from "../models/proUserModel.js";

const userSignUp = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
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
        message: "Please upload avatar",
      });

    const exist = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const result = await uploadFileToCloudinary([file]);
    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const user = await User.create({
      avatar,
      name,
      email,
      password,
      phone,
      address,
      gender,
      city,
      state,
      pinCode,
      country,
    });

    sendToken(res, user, 201, "User created successfully");
  } catch (error) {
    res.status(500).send({ success: false, message: "Sign Up failed", error });
  }
};

const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [normalUser, proUser] = await Promise.all([
      User.findOne({ email }).select("+password"),
      ProUser.findOne({ email }).select("+password"),
    ]);

    const user = normalUser || proUser;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid password",
      });
    }
    sendToken(res, user, 200, `${user.name} logged in successfully`);
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in sign in API", error });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);

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

const logout = async (req, res) => {
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
      message: "An error occurred while Logging the user",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user;
    const { name, email, phone, address, city, state, pinCode, country } =
      req.body;

    const file = req.file;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const emailExist = await User.findOne({ email, _id: { $ne: userId } });

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const phoneExist = await User.findOne({ phone, _id: { $ne: userId } });

    if (phoneExist) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const updates = {
      name: name || user.name,
      phone: phone || user.phone,
      email: email || user.email,
      address: address || user.address,
      city: city || user.city,
      state: state || user.state,
      pinCode: pinCode || user.pinCode,
      country: country || user.country,
    };

    let avatar = user.avatar;
    if (file) {
      await deleteFileToCloudinary(avatar.public_id);
      const result = await uploadFileToCloudinary([file]);
      avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
      };
      updates.avatar = avatar;
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
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in update API",
      error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId)
      return res
        .status(404)
        .send({ success: false, message: "User not found" });

    const user = await User.findByIdAndDelete(userId);

    await deleteFileToCloudinary(user.avatar.public_id);

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

export { deleteUser, getMyProfile, logout, updateUser, userSignIn, userSignUp };
