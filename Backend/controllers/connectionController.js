import ConnectionRequest from "../models/connectionModel.js";
import User from "../models/userModel.js";

//send connection request

export const sendConnectionRequest = async (req, res) => {
    try {
        //extract the user id from the request
        const { userId } = req.params;
        const senderId = req.user._id;
        
        if(senderId.toString() === userId){
            return res.status(400).json({ message: "You cannot send a connection request to yourself", success: false });
        }

        if(req.user.connections.includes(userId)){
            return res.status(400).json({ message: "You are already connected.", success: false });
        }

        //check if the user already sent a request to this person
        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            recipient: userId,
            status: "pending",
        });
        
        if (existingRequest) {
            return res.status(400).json({ message: "You have already sent a connection request to this person", success: false });
        }
        
        //create a new connection request
        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId,
        });
        
        await newRequest.save();
        
        return res.status(201).json({ message: "Connection request sent successfully", success: true });
        
    } catch (error) {
    console.log("Error in sendConnectionRequest controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
}


export const acceptConnectionRequest = async (req, res) => {
    try {
        //extract the user id from the request
        const { requestId } = req.params;
        const userId = req.user._id;

        //find request
        const request = await ConnectionRequest.findById(requestId)
        .populate("sender", "name username email")
        .populate("recipient", "name username")

        if (!request) return res.status(404).json({ message: 'Connection request not found', success: false });
        

        //check request for the current user
        if (request.recipient._id.toString()!== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this connection request", success: false });
        }

        //check pending status
        if (request.status!== "pending") {
            return res.status(400).json({ message: "This request has already been proceed", success: false });
        }
    
        //update request status and add the connection
        request.status = "accepted";
        await request.save();
        
        //add sender to recipient connections
        await User.findByIdAndUpdate(
            request.sender._id,
            { $addToSet: { connections: userId } },
        )

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { connections: request.sender._id } },
        )
        
        //create a new notification
        const notification = new Notification({
            recipient: request.sender._id,
            type: "connectionAccepted",
            relatedUser: userId,
        });
        await notification.save();

        //send email
        
        return res.status(200).json({ message: "Connection request accepted successfully", success: true });
                
    } catch (error) {
    console.log("Error in acceptConnectionRequest controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
}