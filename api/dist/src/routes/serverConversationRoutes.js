import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { createConversation, getConversations, getSingleConversation, updateConversation, } from "../controllers/serverConversationController.js";
const router = express.Router();
router.use(verifyJWT);
router
    .route("/:serverId")
    .get(getConversations)
    .post(createConversation);
router
    .route("/:conversationId")
    .get(getSingleConversation)
    .put(updateConversation);
export default router;
