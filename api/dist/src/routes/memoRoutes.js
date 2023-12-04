import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { addMemo, deleteMemo, getMemo, updateMemo } from '../controllers/memoController.js';
const router = express.Router();
router.use(verifyJWT);
router
    .route("/:friendId")
    .post(addMemo)
    .get(getMemo)
    .put(updateMemo)
    .delete(deleteMemo);
export default router;
