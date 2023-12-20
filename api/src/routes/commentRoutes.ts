import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import {
  deleteComment,
  getComments,
  likeComment,
  replyComment,
  updateComment,
  getComment,
  createComment,
  getCommentsLength,
  updateReplyComment,
  deleteReplyComment
} from "../controllers/commentController.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .post(createComment)
  .get(getComments);

router
  .route("/reply/edit/:commentId")
  .put(updateReplyComment)
  .delete(deleteReplyComment);

router
  .route("/reply/:commentId")
  .put(replyComment);

router
  .route("/like/:commentId")
  .put(likeComment);

router
  .route("/length")
  .get(getCommentsLength);

router
  .route("/:commentId")
  .get(getComment)
  .put(updateComment)
  .delete(deleteComment);

export default router;