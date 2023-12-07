import express from 'express';
import {
  addPost,
  addViewOnPost,
  deletePost,
  getPost,
  likePost,
  updatePost,
  getPostsBySortOptions,
  getPostsByAuthorId,
  getTrendPostsByAuthorId,
  getSinglePostReactionsLength
} from "../controllers/postController.js";
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';

const router = express.Router();

router.use(verifyJWT);

router
  .route('/')
  .get(getPostsBySortOptions)
  .post(addPost)

router
  .route('/author/trend/:authorId')
  .get(getTrendPostsByAuthorId);

router
  .route('/author/:authorId')
  .get(getPostsByAuthorId);

router
  .route('/like/:postId')
  .patch(likePost) // TODO: PATCH, cors check

router
  .route('/views/:postId')
  .patch(addViewOnPost) // TODO: PATCH, cors check

router
  .route('/reactions/:postId')
  .get(getSinglePostReactionsLength);

router
  .route('/:postId')
  .get(getPost)
  .put(updatePost)
  .delete(deletePost)

export default router;