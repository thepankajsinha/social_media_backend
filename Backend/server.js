import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/database.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import connectionRoutes from "./routes/notificationRoute.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;


// Middlewares
app.use(express.json({limit:"5mb"})); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // cookies ko frontend me bhejne ke liye
}));


// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);


// Start server and connect DB
app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening on port ${PORT}`);
});
