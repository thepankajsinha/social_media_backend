import cloudinary from "../lib/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";


export const createPost = async (req, res) =>{
    try {
        //extract body
        const {content, image} = req.body;

        let newPost;

        if(image){
            const imgResult = await cloudinary.uploader.upload(image);
            newPost = new Post({
                content,
                image: imgResult.secure_url,
                author: req.user._id,
            })
        }else{
            newPost = new Post({
                content,
                author: req.user._id,
            })
        }

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        
        await newPost.save();

        res.status(201).json({
            message: 'Post created successfully',
            newPost,
            success: true
        })

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getFeedPost = async (req, res) => {
    try {
        const posts = await Post.find({author: {$in: req.user.connections}})
        .populate("author", "name username profilePicture headline")
        .populate("comments.user", "name profilePicture")
        .sort({ createdAt: -1 })

        return res.status(200).json({ posts, success: true });  
    } catch (error) {
        console.log("Error in getFeedPost controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}  

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        
        const post = await Post.findById(postId);
        
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });
        
        if (post.author.toString()!== userId) return res.status(403).json({ message: 'Unauthorized to delete this post', success: false });

        if(post.image){
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
        }
        
        await Post.findByIdAndDelete(postId);
        
        return res.status(200).json({ message: 'Post deleted successfully.', success: true });
          
    } catch (error) {
        console.log("Error in deletePost controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        .populate(
            "author",
            "name username profilePicture headline"
        )
        .populate(
            "comments.user",
            "name profilePicture"
        );
        
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });
        
        return res.status(200).json({ post, success: true });
    } catch (error) {
        console.log("Error in getPostById controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const creaetComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        
        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comments: {user: req.user._id, content } }, 
        },{new: true})
        .populate(
            "author",
            "name email username profilePicture headline"
        );

        //create a notification
        if(post.author.toString() !== req.user._id.toString()){
            const notification = await Notification.create({
                recipient: post.author,
                sender: req.user._id,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId,
            });
            await notification.save();
        }

        //send mail
        try {
            const postUrl = process.env.CLIENT_URL + "/post/" + postId;
            await sendCommentNotificationEmail(
                post.author.email,
                post.author.name,
                req.user.name,
                postUrl,
                content
            );
        } catch (error) {
            console.log("Error in sending comment notification email:", error);
        }


        return res.status(201).json({ message: 'New comment added', comment, success: true });
          
    } catch (error) {
        console.log("Error in creaetComment controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
} 


export const likePost = async (req, res) => {
    try {
        const userId = req.id; //like karne wale user ki id
        const postId = req.params.id; //post id, jisko user like karene wala hai

        const post = await Post.findById(postId); //find post using post id

        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        if(post.likes.includes(userId)){
            //unlike the post
            post.likes = post.likes.filter((id) =>{id.toString() != userId.toString()});
        }else{
            //like the post
            post.likes.push(userId);
            //create a notification
            if(post.author.toString()!== userId.toString()){
                const notification = await Notification.create({
                    recipient: post.author,
                    type: "like",
                    relatedUser: userId,
                    relatedPost: postId,
                });
                await notification.save();
            }
        }    
        await post.save();

        return res.status(200).json({ message: "Post Liked successfully.",post, success: true });  
    } catch (error) {
        console.log("Error in creaetComment controller ", error.message);
        res.status(500).json({ message: 'Internal Server error' });
    }
} 


