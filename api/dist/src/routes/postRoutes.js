import express from 'express';
import { addPost, addViewOnPost, deletePost, findByPostsCategory, getLatestPosts, getPost, getTrendPosts, likePost, updatePost, } from "../controllers/postController.js";
const router = express.Router();
router
    .route('/')
    .post(addPost);
router
    .route('/:postId')
    .get(getPost)
    .put(updatePost)
    .delete(deletePost);
router
    .route('/like/:postId')
    .put(likePost);
router
    .route('/views/postId')
    .put(addViewOnPost);
router
    .route('/latest')
    .get(getLatestPosts);
router
    .route('/trend')
    .get(getTrendPosts);
router
    .route('/category')
    .get(findByPostsCategory);
export default router;
