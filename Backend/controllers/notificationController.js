import Notification from "../models/notificationModel.js";

export const getUserNotification = async (req, res) =>{
    try {
        // find notifications
        const notifications = await Notification.find({ recipient: req.user._id}).sort({createdAt: -1})
        .populate("relatedUser", "name username profilePicture")
        .populate("relatedPost", "content image")
        
        return res.status(200).json({ notifications, success: true });
        
    } catch (error) {
        console.log("Error in getUserNotification controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}