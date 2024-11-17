import express from 'express';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { acceptConnectionRequest, sendConnectionRequest } from '../controllers/connectionController.js';

const router = express.Router();


router.post("/request/:userId", protectRoute, sendConnectionRequest);
router.put("/accept/:requestId", protectRoute, acceptConnectionRequest);
router.put("/reject/:requestId", protectRoute, rejectConnectionRequest);

//get all connection requests for the curent user
router.get("/requests", protectRoute, getConnectionRequests);


//get all connections for a user
router.get("/", protectRoute, getUserConnections);
router.delete("/:userId", protectRoute, removeConnection);
router.get("/status/:userId", protectRoute, getConnectionStatus);


export default router;