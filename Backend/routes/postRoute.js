import express from 'express';
import {isAuth} from "../middlewares/isAuth.js";
import upload from '../middlewares/multer.js';
import { bookmarkPost, creaetComment, createPost, deletePost, dislikePost, getAllPosts, getCommentsOfPost, getUserPost, likePost } from '../controllers/postController.js';

const router = express.Router();

// Import the controllers
router.post("/addpost", isAuth, upload.single("image"), createPost )
router.get("/all", isAuth, getAllPosts )
router.get("/userpost/all", isAuth, getUserPost )
router.get("/:id/like", isAuth, likePost )
router.get("/:id/dislike", isAuth, dislikePost )
router.post("/:id/comment", isAuth, creaetComment )
router.post("/:id/comment/all", isAuth, getCommentsOfPost )
router.delete("/delete/:id", isAuth, deletePost )
router.delete("/:id/bookmark", isAuth, bookmarkPost )

export default router;