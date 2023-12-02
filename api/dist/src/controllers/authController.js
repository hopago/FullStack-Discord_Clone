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
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/jwt.js";
import FriendAcceptReject from "../models/FriendRequestTable.js";
export const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userName, password, email } = req.body;
        if (!userName || !password || !email)
            throw new HttpException(400, "UserName, Email, Password are required...");
        const duplicate = yield User.findOne({
            userName,
        });
        if (duplicate)
            throw new HttpException(409, "");
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User(Object.assign(Object.assign({}, req.body), { password: hash }));
        yield newUser.save();
        const userId = (_a = newUser._id) === null || _a === void 0 ? void 0 : _a.toString();
        let newFriendRequestTable;
        if (typeof userId === "string") {
            newFriendRequestTable = new FriendAcceptReject({
                referenced_user: userId
            });
            yield newFriendRequestTable.save();
        }
        else {
            return res.sendStatus(500).json("Something went wrong in userId...");
        }
        res.status(201).json("User has been created...");
    }
    catch (err) {
        next(err);
    }
});
export const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    try {
        const { userName, password } = req.body;
        if (!userName || !password)
            throw new HttpException(400, "UserName and Password are required...");
        const user = yield User.findOne({
            userName,
        });
        if (!user)
            throw new HttpException(400, "User not found...");
        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isCorrect)
            return res.sendStatus(401);
        if (isCorrect) {
            const accessToken = jwt.sign({
                userInfo: {
                    id: user._id,
                    isVerified: user.isVerified,
                    type: user.type,
                },
            }, ACCESS_TOKEN_SECRET, { expiresIn: "3h" });
            const newRefreshToken = jwt.sign({
                userInfo: {
                    id: user._id,
                },
            }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
            let newRefreshTokenArray = !(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)
                ? user.refreshToken
                : user.refreshToken.filter((rt) => rt !== cookies.jwt);
            if (cookies === null || cookies === void 0 ? void 0 : cookies.jwt) {
                const refreshToken = cookies.jwt;
                const foundToken = yield User.findOne({ refreshToken }).exec();
                if (!foundToken) {
                    newRefreshTokenArray = [];
                }
                res.clearCookie("jwt", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
            }
            user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            yield user.save();
            res
                .cookie("jwt", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
                .status(200)
                .json({ accessToken });
        }
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
        const refreshToken = cookies.jwt;
        const user = yield User.findOne({
            refreshToken,
        }).exec();
        if (!user) {
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            return res.sendStatus(204);
        }
        user.refreshToken = user.refreshToken.filter((rt) => rt !== refreshToken);
        yield user.save();
        res
            .clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })
            .sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
export const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
        res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    try {
        console.log(refreshToken);
        const user = yield User.findOne({ refreshToken }).exec();
        console.log(user);
        if (!user) {
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    res.sendStatus(403);
                const hackedUser = yield User.findOne({
                    _id: decoded.userInfo.id,
                }).exec();
                if (hackedUser) {
                    hackedUser.refreshToken = [];
                    yield (hackedUser === null || hackedUser === void 0 ? void 0 : hackedUser.save());
                }
            }));
            return res.sendStatus(403);
        }
        const newRefreshTokenArray = user.refreshToken.filter((rt) => rt !== refreshToken);
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err || decoded.userInfo.id !== user._id) {
                user.refreshToken = [...newRefreshTokenArray];
                yield user.save();
                if (err)
                    res.sendStatus(403);
                return;
            }
            const accessToken = jwt.sign({
                userInfo: {
                    id: user._id,
                    isVerified: user.isVerified,
                    type: user.type,
                },
            }, ACCESS_TOKEN_SECRET, { expiresIn: "3h" });
            const newRefreshToken = jwt.sign({
                userInfo: {
                    id: user._id,
                },
            }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
            user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            yield user.save();
            res.cookie("jwt", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ accessToken });
        }));
    }
    catch (err) {
        next(err);
    }
});
