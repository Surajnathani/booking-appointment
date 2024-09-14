import express from "express";
import {
  deleteProUser,
  getAllProfile,
  getSingleProfile,
  profile,
  proLogout,
  proUserSignUp,
  searchProfile,
  updateProUser,
} from "../controllers/proUserController.js";
import {
  ownerSignUpValidator,
  proUserUpdateValidator,
  validateHandler
} from "../lib/validator.js";
import { isAuthenticated, isProUser } from "../middlewares/auth.js";
import { image, multerErrorHandler } from "../middlewares/multer.js";

const app = express.Router();

app.post(
  "/signup",
  image,
  multerErrorHandler,
  ownerSignUpValidator(),
  validateHandler,
  proUserSignUp
);

app.use(isAuthenticated);

app.get("/getAll", getAllProfile);

app.get("/getSingle/:id", getSingleProfile);

app.get("/searchProfile", searchProfile);

app.use(isProUser);

app.get("/me", profile);

app.delete("/deleteProUser", deleteProUser);

app.put(
  "/updateProUser",
  image,
  multerErrorHandler,
  proUserUpdateValidator(),
  validateHandler,
  updateProUser
);

app.get("/logout", proLogout);

export default app;
