import express from 'express';
import {
  addPost,
  addViewOnPost,
  deletePost,
  getPost,
  likePost,
  updatePost,
  getPostsBySortOptions,
  getPostsByAuthorId
} from "../controllers/postController.js";
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';

const router = express.Router();

router.use(verifyJWT);

router
  .route('/')
  .get(getPostsBySortOptions)
  .post(addPost)

router
  .route('/author/:authorId')
  .get(getPostsByAuthorId);

router
  .route('/:postId')
  .get(getPost)
  .put(updatePost)
  .delete(deletePost)

router
  .route('/like/:postId')
  .put(likePost)

router
  .route('/views/:postId')
  .put(addViewOnPost)

export default router;