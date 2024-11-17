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


export const markNotificationAsRead = async (req, res) =>{
    try {
        //notifications id
        const notificationId = req.params.id;
    
        // find notifications
        const notification = await Notification.findByIdAndUpdate({
            _id: notificationId,
            recipient: req.user._id
        },{read: true}, {new : true})
        
        return res.status(200).json({ notification, success: true });
        
    } catch (error) {
        console.log("Error in markNotificationAsRead controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const deleteNotification = async (req, res) =>{
    try {
        //notifications id
        const notificationId = req.params.id;
    
        // find notifications
        const notification = await Notification.findByIdAndDelete({
            _id: notificationId,
            recipient: req.user._id
        })
        
        return res.status(200).json({ notification, message: "Notification deleted successfully.", success: true });
        
    } catch (error) {
        console.log("Error in markNotificationAsRead controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}