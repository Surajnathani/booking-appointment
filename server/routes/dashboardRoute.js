import express from "express";
import { isAuthenticated, isProUser } from "../middlewares/auth.js";
import { dashboardStats } from "../controllers/dashboardController.js";

const app = express();

app.use(isAuthenticated, isProUser);

app.get("/stats", dashboardStats);

export default app;
