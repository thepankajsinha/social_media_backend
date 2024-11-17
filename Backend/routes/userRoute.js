import express from 'express';
import { getPublicProfile, getSuggestedConnections, updateProfile} from '../controllers/userController.js';
import upload from '../middlewares/multer.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get("/suggestions", protectRoute, getSuggestedConnections );
router.get("/:username", protectRoute, getPublicProfile );


router.put("/profile", protectRoute, updateProfile );

export default router;