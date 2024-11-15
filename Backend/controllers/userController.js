import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


//registerUser
export const registerUser = async (req, res) => {
    try {
        //extract the user details from the request body
        const { username, email, password } = req.body;

        //validate the user details
        if (!username ||!email ||!password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        //check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a new user
        await User.create({
            username,
            email,
            password: hashedPassword
        })
        res.status(201).json({ message: 'User registered successfully', success: true });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//loginUser
export const loginUser = async (req, res) => {
    try {
        //extract the user details from the request body
        const {email, password } = req.body;

        //validate the user details
        if (!email ||!password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        //check if the user is already registered or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false});
        }
        
        //check if the password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid password', success: false });
        }
        
        //generate a JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        
        //set the JWT token as a cookie and send the response to the client
        return res.cookie("token", token, {httpOnly: true, maxAge: 1*24*60*60*1000}).json({
            message: `Welocme back ${user.username}`,
            success: true,
            user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//logoutUser
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.json({ message: 'Logged out successfully', success: true });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//getProfile
export const getProfile = async (req, res) => {
    try {
        //extract the user id from the request params
        const userId = req.params.id;

        //check if the user exists
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        
        //send the user profile to the client
        res.status(200).json({ user, success: true });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//editProfile
export const editProfile = async (req, res) => {
    try {
        //extract the user id from the isAuth middleware
        const userId = req.id;
        
        //extract the updated user details from the request body
        const {bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;
        
        //upload the profile picture if it exists
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }
        
        //check if the user exists
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        //update the user profile
        if(bio){
            user.bio = bio;
        }
        if(gender){
            user.gender = gender;
        }
        if (profilePicture) {
            user.profilePicture = cloudResponse.secure_url;
        }
        await user.save();
        
        //send the updated user profile to the client
        res.status(200).json({ message: "profile updated successfully.", success: true , user});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//get suggested user
export const getSuggestedUsers = async (req, res) => {
    try {

        //get all users excluding the current user
        const suggestedUsers = await User.find({ _id: { $ne: req.id }}).select("-password");

        if(!suggestedUsers){
            return res.status(404).json({ message: 'No suggested users found', success: false });
        }
        
        //send the suggested users to the client
        res.status(200).json({ users: suggestedUsers, success: true });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//followOrUnfollow
export const followOrUnfollow = async (req, res) => {
    try {
        const userId = req.id; // logged-in user ID
        const targetUserId = req.params.id; // target user ID to follow/unfollow
        
        if (userId === targetUserId) {
            return res.status(400).json({ message: 'You cannot follow yourself', success: false });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user) {
            return res.status(404).json({ message: 'Logged-in user not found', success: false });
        }
        
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found', success: false });
        }

        const isFollowing = user.following.includes(targetUserId);

        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: userId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: userId } })
            ]);
            return res.status(200).json({
                message: "Unfollowing user successfully.",
                success: true,
            });

        } else {
            await Promise.all([
                User.updateOne({ _id: userId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: userId } })
            ]);
            return res.status(200).json({
                message: "Following user successfully.",
                success: true,
            });
        }
    } catch (error) {
        console.error("Error in followOrUnfollow function:", error); // Log the error for debugging
        return res.status(500).json({ message: 'Server error', success: false });
    }
};
