import express from "express";
import { isAuthenticated, isProUser } from "../middlewares/auth.js";
import {
  deleteStaff,
  getStaff,
  newStaffMember,
  searchStaff,
  updateStaff,
} from "../controllers/staffController.js";
import { staffValidator, validateHandler } from "../lib/validator.js";

const app = express.Router();

app.use(isAuthenticated, isProUser);

app.post("/newStaff", staffValidator(), validateHandler, newStaffMember);

app.get("/getStaff", getStaff);

app.get("/searchStaff", searchStaff);

app.put("/updateStaff/:id", updateStaff);

app.delete("/deleteStaff/:id", deleteStaff);

export default app;
