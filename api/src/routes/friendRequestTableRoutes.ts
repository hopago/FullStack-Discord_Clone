import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import {
  getAllFriendRequest,
  getReceivedCount,
  handleRequestFriend,
  sendFriend,
} from "../controllers/friendRequestTableController.js";

{/* 12 05 22 40 */}

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
  .route("/process/:senderId")
  .put(handleRequestFriend);

export default router;