import express from "express";
import {
  deleteReview,
  getReview,
  postReview
} from "../controllers/reviewController.js";
import { reviewValidator, validateHandler } from "../lib/validator.js";
import { isAuthenticated, isUser } from "../middlewares/auth.js";

const app = express();

app.use(isAuthenticated);

app.post(
  "/postReview/:id",
  reviewValidator(),
  validateHandler,
  isUser,
  postReview
);

app.get("/getReview/:userId", getReview);

app.delete("/deleteReview/:id", deleteReview);

export default app;
