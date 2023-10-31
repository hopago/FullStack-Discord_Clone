import express from 'express';
import { verifyJWT } from "../middleware/jwt/verifyJWT.js";
import { createConversation, getConversations, getSingleConversation, updateConversation } from '../controllers/conversationController.js';

const router = express.Router();

router.use(verifyJWT);

router
  .route('/')
  .get(getConversations)
  .post(createConversation);

router
  .route('/:conversationId')
  .get(getSingleConversation)
  .put(updateConversation);

export default router;