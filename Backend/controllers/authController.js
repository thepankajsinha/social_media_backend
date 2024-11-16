import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
// import cloudinary from "../utils/cloudinary.js";

export const signup = async (req, res) => {
    try {
        const {name, username, email, password } = req.body;
        
        //validate the user details
        if (!name ||!username ||!email ||!password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        //chek existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        //check existing username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        //check password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a new user
        const user =  new User({
            name,
            username,
            email,
            password: hashedPassword
        })
        await user.save();
        
        //generate a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        //set token in cookies
        res.cookie('jwt-ProConnect', token,{
            httpOnly: true,
            maxAge: 3*24*60*60*1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(201).json({ message: 'User registered successfully', success: true });
        
        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl)
        } catch (error) {
            console.log("Error in sending welcome email: ", error.message);
            res.status(500).json({ message: 'Internal Server error' });
        }

    } catch (error) {
        console.log("Error in signup: ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}

export const login = (req, res) => {
    
}

export const logout = (req, res) => {
    
}