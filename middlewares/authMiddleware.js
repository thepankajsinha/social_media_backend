import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to verify JWT token

export const protectRoute = async (req, res, next) => {

  try {
    // extract token from request cookies
    const token = req.cookies["jwt-ProConnect"];

    // token validation
    if (!token) {
      return res.status(401).json({ message: 'Token is not found', success: false });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({ message: 'Token is expired' });
    }

    // find user by id
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: 'User not found', success: false });
    }
    
    // add user to request
    req.user = user;
    
    
    next();
  } catch (error) {
    // error handling
    console.log("Error in protectRoute: middleware ", error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};