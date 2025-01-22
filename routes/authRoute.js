import express from 'express';
import { login, logout, signup , getCurrentUser} from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Import the controllers

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protectRoute, getCurrentUser);

export default router;