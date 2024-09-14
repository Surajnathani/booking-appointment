import { v2 as cloudinary } from "cloudinary";
import cluster from "cluster";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import os from "os";
import { corsOptions } from "./constants/config.js";
import { connectDB } from "./utils/features.js";

import appointmentRoute from "./routes/appointmentRoute.js";
import contactRoute from "./routes/contactRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import proUserRoute from "./routes/proUserRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import staffRoute from "./routes/staffRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config({ path: "./.env" });

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    cluster.fork();
  });
} else {
  connectDB(mongoURI);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const app = express();
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsOptions));

  app.get("/", (req, res) => {
    res.status(200).send("API IS LIVE");
  });

  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/pro-user", proUserRoute);
  app.use("/api/v1/support", contactRoute);
  app.use("/api/v1/review", reviewRoute);
  app.use("/api/v1/appointment", appointmentRoute);
  app.use("/api/v1/dashboard", dashboardRoute);
  app.use("/api/v1/staff", staffRoute);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
