import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { addBlockUser, deleteBlockUser, getAllBlackList } from '../controllers/blockRequestTableController.js';

{/* 12 05 22 40 */}

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllBlackList);

router
  .route("/:blockUserId")
  .post(addBlockUser)
  .delete(deleteBlockUser);

export default router;