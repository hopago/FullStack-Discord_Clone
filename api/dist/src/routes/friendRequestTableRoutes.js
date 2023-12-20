import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { createNotification, deleteNotification, getAllFriendRequest, getNotifications, getReceivedCount, handleRequestFriend, seeNotification, sendFriend, } from "../controllers/friendRequestTableController.js";
{ /* 12 05 22 40 */ }
const router = express.Router();
router.use(verifyJWT);
router
    .route("/")
    .post(sendFriend)
    .get(getAllFriendRequest);
router
    .route("/count")
    .get(getReceivedCount);
router
    .route("/notifications")
    .get(getNotifications)
    .post(createNotification)
    .patch(seeNotification)
    .delete(deleteNotification);
router
    .route("/process/:senderId")
    .put(handleRequestFriend);
export default router;
