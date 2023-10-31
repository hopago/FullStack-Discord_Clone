var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

import { HttpException } from "../middleware/error/utils.js";
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/jwt.js";

export const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User(Object.assign(Object.assign({}, req.body), { password: hash }));
        yield newUser.save();
        res.status(201).json("User has been created...");
    }
    catch (err) {
        next(err);
    }
});
export const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({
            userName: req.body.userName
        });
        if (!user)
            throw new HttpException(404, "User not found...");
        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isCorrect)
            throw new HttpException(400, "Wrong Creds...");
        const accessToken = jwt.sign({
            userInfo: {
                id: user._id,
                isVerified: user.isVerified,
                type: user.type,
            }
        }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({
            userInfo: {
                id: user._id,
            }
        }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
            .status(200)
            .json({ accessToken });
    }
    catch (err) {
        next(err);
    }
});
export const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            throw new HttpException(204, "");
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
            .status(200)
            .json({ message: 'Cookie cleared...' });
    }
    catch (err) {
        next(err);
    }
});
export const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
            throw new HttpException(401, "Unauthorized...");
        const refreshToken = cookies.jwt;
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw new HttpException(403, "Token is not valid...");
            const foundUser = yield User.findOne({
                _id: decoded.userInfo.id
            }).exec();
            if (!foundUser)
                throw new HttpException(401, "Unauthorized...");
            const accessToken = jwt.sign({
                userInfo: {
                    id: foundUser._id,
                    isVerified: foundUser.isVerified,
                    type: foundUser.type,
                }
            }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.status(200).json({ accessToken });
        }));
    }
    catch (err) {
        next(err);
    }
});
