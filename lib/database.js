import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.error("Error in connectDB:",error.message);
    process.exit(1);
  }
};

export default connectDB;