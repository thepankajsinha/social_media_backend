import express from 'express';
import {creaetComment, createPost, deletePost, getFeedPost,getPostById, likePost } from '../controllers/postController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", protectRoute, getFeedPost);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id", protectRoute, getPostById);
router.post("/:id/comment", protectRoute, creaetComment);
router.post("/:id/like", protectRoute, likePost);

export default router;