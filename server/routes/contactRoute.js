import express from "express";
import { contact } from "../controllers/contactController.js";
import { contactValidator, validateHandler } from "../lib/validator.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/contact", contactValidator(), validateHandler, contact);

export default app;
