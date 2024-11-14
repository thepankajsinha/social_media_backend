import express from 'express';
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import { isAuth } from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// Import the controllers
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/:id/profile", isAuth, getProfile )
router.post("/profile/edit", isAuth, upload.single("profilePicture"), editProfile)
router.get("/suggested",isAuth, getSuggestedUsers)
router.post("/followUnfollow/:id", isAuth, followOrUnfollow)

export default router;