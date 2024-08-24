import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth"

/// first time first
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.get("/test/api", async (req: Request, res: Response) => {
  res.json("Hello there from servicer");
});
app.listen(7000, () => {
  console.log("Server running on localHost:7000");
});
