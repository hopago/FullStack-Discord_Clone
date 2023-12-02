import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import {
  deleteUser,
  getFriends,
  getSingleFriend,
  updateUser,
  removeFriend,
  findUserById,
  getCurrentUser,
  addMemo,
  handleCloseFriends,
} from "../controllers/userController.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getCurrentUser)
  .put(updateUser)
  .delete(deleteUser);

router
  .route("/friends")
  .get(getFriends);

router
  .route("/friends/close/:friendId")
  .put(handleCloseFriends)

router
  .route("/friends/:friendId")
  .get(getSingleFriend)
  .put(addMemo)
  .delete(removeFriend);

router
  .route("/:userId")
  .get(findUserById);

export default router;