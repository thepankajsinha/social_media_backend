import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";


export const getSuggestedConnections = async (req, res) => {
    try {
        //extract the user id from the isAuth middleware
        const currentUser = await User.findById(req.user._id).select("-password");
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        //get all users excluding the current user
        const suggestedUsers = await User.find({ _id: { $ne: req.user._id , $nin: currentUser.connections}}).select("name username profilePicture headline").limit(3);

        if(!suggestedUsers){
            return res.status(404).json({ message: 'No suggested users found', success: false });
        }
        
        return res.status(200).json({ suggestedUsers, success: true });

    } catch (error) {
        console.log("Error in getSuggestedConnections controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username}).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        
        return res.status(200).json({ user, success: true });

    } catch (error) {
        console.log("Error in getPublicProfile controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "headline",
            "profilePicture",
            "bannerImg",
            "about",
            "location",
            "skills",
            "education",
            "experience"
        ]
        const updatedData = {};
        for(const field of allowedFields){
            if(req.body[field]){
                updatedData[field] = req.body[field];
            }
        }

        if(req.body.profilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            updatedData.profilePicture = result.secure_url;
        }

        if(req.body.bannerImg){
            const result = await cloudinary.uploader.upload(req.body.bannerImg);
            updatedData.profilePicture = result.secure_url;
        }
        
        const user = await User.findByIdAndUpdate(req.user._id, {$set: updatedData}, {new: true}).select("-password");
        
        return res.status(200).json({ user, success: true });

    } catch (error) {
        console.log("Error in updateProfile controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}

