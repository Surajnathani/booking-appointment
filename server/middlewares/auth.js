import { APPOINTMENT_TOKEN } from "../constants/config.js";
import jwt from "jsonwebtoken";
import { ProUser } from "../models/proUserModel.js";
import { User } from "../models/userModel.js";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies[APPOINTMENT_TOKEN];

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Please login to access this",
    });
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData._id;
  next();
};

const isProUser = async (req, res, next) => {
 try {
    const user = await ProUser.findById(req.user); 
    if (user && user.role === "ProUser") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Pro Users can access this resource.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const isUser = async (req, res, next) => {
   try {
    const user = await User.findById(req.user);  
    if (user && user.role === "User") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Users can access this resource.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { isAuthenticated, isProUser, isUser };
