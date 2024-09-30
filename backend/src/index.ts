import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import myHostelRoutes from "./routes/my-hostel";
import { env } from "process";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


/// first time first
// mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  });

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

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hostels", myHostelRoutes);
app.get("/test/api", async (req: Request, res: Response) => {
  res.json("Hello there from servicer");
});

// Define custom error classes
class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    // Handle known API errors
    res.status(err.statusCode).json({ error: err.message });
  } else {
    // Handle unknown errors
    console.error("Unhandled error:", err);
    res.status(500).json({
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal Server Error",
    });
  }
});

app.listen(7000, () => {
  console.log("Server running on localHost:7000");
});
