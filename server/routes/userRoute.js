import express from "express";
import {
  deleteUser,
  getMyProfile,
  logout,
  updateUser,
  userSignIn,
  userSignUp
} from "../controllers/userController.js";
import {
  signInValidator,
  signUpValidator,
  userUpdateValidator,
  validateHandler,
} from "../lib/validator.js";
import { isAuthenticated, isUser } from "../middlewares/auth.js";
import { avatar, multerErrorHandler } from "../middlewares/multer.js";

const app = express.Router();

app.post(
  "/signup",
  avatar,
  multerErrorHandler,
  signUpValidator(),
  validateHandler,
  userSignUp
);

app.post("/signin", signInValidator(), validateHandler, userSignIn);

app.use(isAuthenticated, isUser);

app.get("/me", getMyProfile);

app.delete("/deleteUser", deleteUser);

app.put(
  "/updateUser",
  avatar,
  multerErrorHandler,
  userUpdateValidator(),
  validateHandler,
  updateUser
);

app.get("/logout", logout);

export default app;
