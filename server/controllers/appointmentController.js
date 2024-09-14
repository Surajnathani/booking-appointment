import { Appointment } from "../models/appointmentModel.js";
import { ProUser } from "../models/proUserModel.js";
import { User } from "../models/userModel.js";

const createAppointment = async (req, res) => {
  try {
    const { service, date, time, status, email } = req.body;
    let userId = req.user;
    const proUserId = req.params.id;
    let userAppointment = req.user;

    if (userId.toString() === proUserId.toString()) {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      userAppointment = user._id;
    }

    const isProUser = await ProUser.findById(userId);

    if (isProUser && userId.toString() !== proUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to book this appointment",
      });
    }

    const proUser = await ProUser.findById(proUserId);

    const existingAppointments = await Appointment.countDocuments({
      date,
      time,
      senderId: userAppointment,
    });

    if (
      existingAppointments > proUser.numberOfAppointments &&
      userId.toString() !== proUserId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: `Appointment full. Pick another slot.`,
      });
    }

    const serviceData = proUser.services.find((s) => s.name === service);

    if (!serviceData) {
      return res.status(400).json({
        success: false,
        message: `Service ${service} not found`,
      });
    }

    const serviceCharge = serviceData.price;

    const appointment = await Appointment.create({
      service,
      date,
      time,
      status,
      charge: serviceCharge,
      senderId: userAppointment,
      receiverId: proUserId,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in appointment api" });
  }
};

const getCurrentAppointment = async (req, res) => {
  try {
    const userId = req.user;

    const appointments = await Appointment.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: { $in: ["Pending", "Ongoing"] },
    })
      .populate({
        path: "receiverId",
        select: "centerName address",
      })
      .populate({
        path: "senderId",
        select: "name avatar email phone -_id",
      })
      .select("service date time status")
      .sort({ date: -1, time: -1 });

    return res.status(200).json({
      success: true,
      message: "Current Appointment",
      appointments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in appointment api" });
  }
};

const getPreviousAppointment = async (req, res) => {
  try {
    const userId = req.user;

    const appointments = await Appointment.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: { $in: ["Cancelled", "Completed", "Rejected"] },
    })
      .populate({
        path: "receiverId",
        select: "centerName address",
      })
      .populate({
        path: "senderId",
        select: "name avatar email phone -_id",
      })
      .select("service date time status")
      .sort({ date: -1, time: -1 });

    return res.status(200).json({
      success: true,
      message: "Previous Appointment",
      appointments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in appointment api" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { status, service, date, time } = req.body;
    const userId = req.user;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.status === "Cancelled" ||
      appointment.status === "Completed" ||
      appointment.status === "Rejected"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot update cancelled or completed appointment",
      });
    }

    if (
      status === "cancel" &&
      userId.toString() !== appointment.senderId.toString() &&
      !(
        userId.toString() === appointment.receiverId.toString() &&
        appointment.status === "Ongoing"
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allow to cancel this appointment",
      });
    }

    const updates = {
      status: status || appointment.status,
      service: service || appointment.service,
      date: date || appointment.date,
      time: time || appointment.time,
    };

    if (userId.toString() === appointment.senderId.toString()) {
      if (status === "cancel") {
        updates.status = "Cancelled";
      }
    }

    if (userId.toString() === appointment.receiverId.toString()) {
      if (status === "accepted") {
        updates.status = "Ongoing";
      } else if (status === "rejected") {
        updates.status = "Rejected";
      } else if (status === "completed" && appointment.status === "Ongoing") {
        updates.status = "Completed";
      } else if (status === "cancel" && appointment.status === "Ongoing") {
        updates.status = "Cancelled";
      }
    }

    if (service) {
      updates.service = service;
    }
    if (date) {
      updates.date = date;
    }
    if (time) {
      updates.time = time;
    }

    const hasChanges = Object.keys(updates).some(
      (key) => updates[key] !== appointment[key]
    );

    if (!hasChanges) {
      return res.status(400).json({
        success: false,
        message: "Invalid update or no changes made",
      });
    }

    Object.assign(appointment, updates);

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in appointment api" });
  }
};

export {
  createAppointment,
  getCurrentAppointment,
  getPreviousAppointment,
  updateAppointment,
};
