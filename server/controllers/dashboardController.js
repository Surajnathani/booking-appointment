import mongoose from "mongoose";
import { Appointment } from "../models/appointmentModel.js";
import { Staff } from "../models/staffModel.js";
import moment from "moment";

const dashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);
    const todayDate = moment().format("YYYY-MM-DD").toString();

    const sevenDayAgo = moment()
      .subtract(6, "days")
      .format("YYYY-MM-DD")
      .toString();

    const startDate = moment()
      .subtract(11, "months")
      .startOf("month")
      .format("YYYY-MM-DD");

    const endDate = moment().endOf("month").format("YYYY-MM-DD");

    const [
      appointmentCount,
      staffCount,
      totalEarnings,
      todayEarnings,
      weeklyEarnings,
      monthlyEarnings,
    ] = await Promise.all([
      Appointment.countDocuments({
        receiverId: userId,
        status: "Completed",
        date: { $lte: todayDate },
      }),

      Staff.countDocuments({ staffOwnerId: userId }),

      Appointment.aggregate([
        {
          $match: {
            receiverId: userId,
            status: "Completed",
            date: { $lte: todayDate },
          },
        },
        { $group: { _id: null, earning: { $sum: "$charge" } } },
      ]),

      Appointment.aggregate([
        {
          $match: { receiverId: userId, status: "Completed", date: todayDate },
        },
        { $group: { _id: null, earning: { $sum: "$charge" } } },
      ]),

      Appointment.aggregate([
        {
          $match: {
            receiverId: userId,
            status: "Completed",
            date: { $gte: sevenDayAgo, $lte: todayDate },
          },
        },
        { $group: { _id: "$date", totalEarnings: { $sum: "$charge" } } },
        { $sort: { _id: 1 } },
      ]),

      Appointment.aggregate([
        {
          $match: {
            receiverId: userId,
            status: "Completed",
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $substr: ["$date", 0, 4] },
              month: { $substr: ["$date", 5, 2] },
            },
            totalEarnings: { $sum: "$charge" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]),
    ]);

    const totalEarning =
      totalEarnings.length > 0 ? totalEarnings[0].earning : 0;

    const todayEarning =
      todayEarnings.length > 0 ? todayEarnings[0].earning : 0;

    const weeklyEarning = new Array(7).fill(0);

    weeklyEarnings.forEach((earning) => {
      const index = moment(earning._id, "YYYY-MM-DD").diff(
        moment(sevenDayAgo, "YYYY-MM-DD"),
        "days"
      );
      if (index >= 0 && index < 7) {
        weeklyEarning[index] = earning.totalEarnings;
      }
    });

    const monthlyEarning = Array(12).fill(0);

    monthlyEarnings.forEach((earning) => {
      const earningDate = moment()
        .year(earning._id.year)
        .month(earning._id.month - 1)
        .startOf("month");
      const index = moment().startOf("month").diff(earningDate, "months");
      if (index >= 0 && index < 12) {
        monthlyEarning[index] = earning.totalEarnings;
      }
    });

    const stats = {
      appointmentCount,
      staffCount,
      totalEarning,
      todayEarning,
      weeklyEarning,
      monthlyEarning: monthlyEarning.reverse(),
    };

    return res.status(201).json({
      success: true,
      message: "Dashboard Stats",
      stats,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in getting user profile",
      error,
    });
  }
};

export { dashboardStats };
