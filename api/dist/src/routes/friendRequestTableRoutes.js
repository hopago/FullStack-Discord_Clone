import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { getAllFriendRequest, handleRequestFriend, sendFriend, } from "../controllers/friendRequestTableController.js";
const router = express.Router();
router.use(verifyJWT);
router
    .route("/")
    .get(getAllFriendRequest)
    .put(sendFriend);
router.route("/:senderId").put(handleRequestFriend);
export default router;
