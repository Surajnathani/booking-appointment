import { Staff } from "../models/staffModel.js";

const newStaffMember = async (req, res) => {
  try {
    const { username, email, phone, date, type } = req.body;

    const userId = req.user;

    const exist = await Staff.findOne({
      $and: [{ staffOwnerId: userId }, { $or: [{ email }, { phone }] }],
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Member already exists",
      });
    }

    const staffMember = await Staff.create({
      username,
      email,
      phone,
      date,
      type,
      staffOwnerId: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Staff member created successfully",
      staffMember,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getStaff = async (req, res) => {
  try {
    const userId = req.user;

    const staff = await Staff.find({ staffOwnerId: userId }).select(
      "-staffOwnerId"
    );

    return res.status(200).json({
      success: true,
      message: "Staff get successfully",
      staff,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateStaff = async (req, res) => {
  try {
    const { username, email, phone, date, type } = req.body;

    const userId = req.user;
    const staffId = req.params.id;

    const staffMember = await Staff.findOne({
      staffOwnerId: userId,
      _id: staffId,
    });

    if (!staffMember) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found" });
    }

    const emailExist = await Staff.findOne({
      email,
      _id: { $ne: staffMember._id },
    });

    if (emailExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const phoneExist = await Staff.findOne({
      phone,
      _id: { $ne: staffMember._id },
    });

    if (phoneExist) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const updates = {
      username: username || staffMember.username,
      email: email || staffMember.email,
      phone: phone || staffMember.phone,
      date: date || staffMember.date,
      type: type || staffMember.type,
    };

    const hasChanges = Object.keys(updates).some(
      (key) => updates[key] !== staffMember[key]
    );

    if (!hasChanges) {
      return res.status(200).json({
        success: false,
        message: "No changes detected, no update performed.",
      });
    }

    Object.assign(staffMember, updates);

    const updateStaffMember = await staffMember.save();

    return res.status(200).json({
      success: true,
      message: "staff member updated successfully",
      updateStaffMember,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const searchStaff = async (req, res) => {
  try {
    const userId = req.user;
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required for searching",
      });
    }

    const staffMember = await Staff.find({
      staffOwnerId: userId,
      username: { $regex: new RegExp(username, "i") },
    });

    return res.status(200).json({
      success: true,
      staffMember,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const userId = req.user;
    const staffId = req.params.id;

    const staffMember = await Staff.findOne({
      staffOwnerId: userId,
      _id: staffId,
    });

    if (!staffMember) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member not found" });
    }

    await Staff.findByIdAndDelete(staffId);

    return res.status(200).json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { newStaffMember, getStaff, updateStaff, searchStaff, deleteStaff };
