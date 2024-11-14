import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/postModel.js";

export const createPost = async (req, res) =>{
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        // image upload 
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        })

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 })
        .populate({ path: 'author', select: 'username , profilePicture'})
        .populate({path: 'comments',sort: {createdAt: -1},populate: { path: 'author', select: 'username, profilePicture' }});
        return res.status(200).json({ posts, success: true });  
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}  


export const getUserPost = async (req, res) => {
    try {
        const autherId = req.id;
        const posts = await Post.find({author:autherId }).sort({ createdAt: -1 })
        .populate({ path: 'author', select: 'username , profilePicture'})
        .populate({path: 'comments',sort: {createdAt: -1},populate: { path: 'author', select: 'username, profilePicture' }});
        return res.status(200).json({ posts, success: true });  
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


export const likePost = async (req, res) => {
    try {
        const userId = req.id; //like karne wale user ki id
        const postId = req.params.id; //post id, jisko user like karene wala hai

        const post = await Post.findById(postId); //find post using post id

        if (!post) return res.status(404).json({ message: 'Post not found' });

        await Post.updateOne({$addToSet: {likes: userId}})
        await post.save();

        return res.status(200).json({ message: "Post Liked",post, success: true });  
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}  



export const dislikePost = async (req, res) => {
    try {
        const userId = req.id; //like karne wale user ki id
        const postId = req.params.id; //post id, jisko user like karene wala hai

        const post = await Post.findById(postId); //find post using post id

        if (!post) return res.status(404).json({ message: 'Post not found' });

        await Post.updateOne({$pull: {likes: userId}})
        await post.save();

        return res.status(200).json({ message: "Post Disliked",post, success: true });  
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
} 