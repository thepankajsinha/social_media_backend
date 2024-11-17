import express from 'express';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { deleteNotification, getUserNotification, markNotificationAsRead } from '../controllers/notificationController.js';

const router = express.Router();

// Import the controllers
router.get("/", protectRoute, getUserNotification)
router.put("/:id/read", protectRoute, markNotificationAsRead)
router.delete("/:id", protectRoute, deleteNotification)

export default router;