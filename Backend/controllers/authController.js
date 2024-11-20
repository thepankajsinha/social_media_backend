import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

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

    } catch (error) {
        console.log("Error in signup: ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const login = async (req, res) => {
    try {
        const {username, password } = req.body;
        
        //validate the user details
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        //check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false});
        }
        //check if the password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid password', success: false });
        }
        
        //generate a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        //set token in cookies
        res.cookie('jwt-ProConnect', token,{
            httpOnly: true,
            maxAge: 3*24*60*60*1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ message: `Welcome back ${user.username}`, success: true, user });

    } catch (error) {
        console.log("Error in login: ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const logout = (req, res) => {
    try {
        res.clearCookie('jwt-ProConnect');
        return res.json({ message: 'Logged out successfully', success: true });
    } catch (error) {
        console.log("Error in logout: ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const getCurrentUser = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.log("Error in getCurrentUser: ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}