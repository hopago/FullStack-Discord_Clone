import express from 'express';
import { verifyJWT } from '../middleware/jwt/verifyJWT.js';
import { deleteServer, getMembers, getAllServers, likeServer, updateMembers, updateServer, getSingleServer, getAllUserServers, deleteUserServer, createServer, searchServer } from "../controllers/serverController.js";
const router = express.Router();
router.use(verifyJWT);
router
    .route("/discover")
    .get(getAllServers);
router
    .route("/")
    .get(getAllUserServers)
    .post(createServer)
    .delete(deleteUserServer);
router
    .route("/:serverId")
    .get(getSingleServer)
    .put(updateServer)
    .delete(deleteServer);
router
    .route("/members/:serverId")
    .get(getMembers)
    .put(updateMembers);
router
    .route("/like/:serverId")
    .put(likeServer);
router
    .route("/search")
    .get(searchServer);
export default router;
