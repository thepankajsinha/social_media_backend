import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/database.js";
import userRoute from "./routes/userRoute.js"

dotenv.config();

const app = express();

//import environment variables
const PORT = process.env.PORT || 8000;


// Middlewares
app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(cors());


// Routes
app.use("/api/v1/user", userRoute);


//start server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});