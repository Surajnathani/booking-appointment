import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const APPOINTMENT_TOKEN = "appointment-token";

export { corsOptions, APPOINTMENT_TOKEN };
