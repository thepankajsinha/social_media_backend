import express from 'express';
import { login, logout, signup } from '../controllers/authController.js';
const router = express.Router();

// Import the controllers

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;