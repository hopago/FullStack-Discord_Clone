import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { addBlockUser, deleteBlockUser, getAllBlackList } from '../controllers/blockRequestTableController.js';

const router = express.Router();

router.use(verifyJWT);

router.route("/").get(getAllBlackList);

router.route("/:blockUserId").post(addBlockUser);

router.route("/delete/:blockUserId").delete(deleteBlockUser);

export default router;