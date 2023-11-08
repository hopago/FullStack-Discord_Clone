import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { deleteComment, getComments, likeComment, replyComment, updateComment, } from "../controllers/commentController.js";
const router = express.Router();
router.use(verifyJWT);
router
    .route("/")
    .get(getComments);
router
    .route("/:commentId")
    .put(updateComment)
    .delete(deleteComment);
router
    .route("/reply/:commentId")
    .put(replyComment);
router
    .route("/like/:commentId")
    .put(likeComment);
export default router;
