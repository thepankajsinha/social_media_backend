import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/database.js";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;


// inbuilt Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(cors());


// Routes



//start server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});