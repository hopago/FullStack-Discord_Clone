import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { createMessage, deleteMessage, getMessages, updatedMessage } from '../controllers/serverMessageController.js';

const router= express.Router();

router.use(verifyJWT);

router
  .route('/:serverId')
  .get(getMessages)
  .post(createMessage);

router
  .route('/:messageId')
  .put(updatedMessage)
  .delete(deleteMessage);

export default router;