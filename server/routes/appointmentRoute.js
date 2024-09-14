import express from "express";
import {
  createAppointment,
  getCurrentAppointment,
  getPreviousAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";
import { appointmentValidator, validateHandler } from "../lib/validator.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express();

app.use(isAuthenticated);

app
  .route("/:id")
  .post(appointmentValidator(), validateHandler, createAppointment)
  .put(updateAppointment);

app.get("/getCurrentAppointment", getCurrentAppointment);
app.get("/getPreviousAppointment", getPreviousAppointment);

export default app;
