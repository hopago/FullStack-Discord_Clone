import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { getMessages, createMessage, updateMessage, deleteMessage, } from "../controllers/messageController.js";
const router = express.Router();
router.use(verifyJWT);
router
    .route('/conversation/:conversationId')
    .get(getMessages)
    .post(createMessage);
router
    .route('/:messageId')
    .put(updateMessage)
    .delete(deleteMessage);
export default router;
