import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authController.js';
const router = express.Router();
router.route('/register')
    .post(register);
router.route('/login')
    .post(login);
router.route('/logout')
    .post(logout);
router.route('/refresh')
    .get(refreshToken);
export default router;
