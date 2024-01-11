import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import {
  getCloseFriend,
  addCloseFriend,
  removeCloseFriend,
} from "../controllers/closeFriendController.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getCloseFriend);

router
  .route("/:friendId")
  .post(addCloseFriend)
  .delete(removeCloseFriend);

export default router;