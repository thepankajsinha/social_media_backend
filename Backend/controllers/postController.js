import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";

export const createPost = async (req, res) =>{
    try {
        const { caption } = req.body; //post ki caption
        const image = req.file; //post ki image
        const authorId = req.id; //post create karne wale user ki id

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
        console.log(post);

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


export const creaetComment = async (req, res) => {
    try {
        const userId = req.id; //comment karne wale user ki id
        const postId = req.params.id; //post id, jisko comment karene wala hai

        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Text required', success: false });


        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        })
        console.log(comment)
        await comment.populate({
            path: 'author',
            select: 'username, profilePicture'
        });
        console.log(comment)
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({ message: 'New comment added', comment, success: true });
          
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
} 


export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        //find comments
        const comments = await Comment.find({ post: postId }).populate({
            path: 'author',
            select: 'username, profilePicture'
        });

        //comment validation
        if (!comments) return res.status(404).json({ message: 'No comments found', success: false });
        
        return res.status(200).json({ comments, success: true });
          
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
} 


export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const autherId = req.id;
        
        const post = await Post.findById(postId);
        
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });
        
        if (post.author.toString()!== autherId) return res.status(403).json({ message: 'Unauthorized to delete this post', success: false });
        
        await Post.findByIdAndDelete(postId);
        
        //remove post from user's post list
        const user = await User.findById(autherId);
        if (user) {
            user.posts = user.posts.filter(postId => postId.toString()!== postId);
            await user.save();
        }
        
        //remove post from all comments
        await Comment.deleteMany({ post: postId });
        
        return res.status(200).json({ message: 'Post deleted', success: true });
          
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const autherId = req.id;
        
        const post = await Post.findById(postId);
        
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        const user = await User.findById(autherId);
        //bookmark
        if (user.bookmarks.includes(post._id)){
            //remove bookmark
            await user.updateOne({$pull: {bookmarks: post._id}});
            await user.save();
            return res.status(200).json({ message: 'Bookmark removed', success: true });
        }else{
            //add bookmark
            await user.updateOne({$addToSet: {bookmarks: post._id}});
            await user.save();
            return res.status(200).json({ message: 'Bookmark added', success: true });
        }
         
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}