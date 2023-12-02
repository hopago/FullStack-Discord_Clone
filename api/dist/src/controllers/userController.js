var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { HttpException } from "../middleware/error/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
export const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const user = yield User.findOne({
            _id: userId,
        })
            .select("-password")
            .lean();
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});
export const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const { userName, description, language, avatar, password, banner } = req.body;
        if (!userName)
            return res.sendStatus(400);
        const user = yield User.findById(userId).exec();
        if (!user)
            return res.status(400).json("Could not found user...");
        user.userName = userName;
        user.description = description;
        user.language = language;
        if (avatar) {
            user.avatar = avatar;
        }
        if (banner) {
            user.banner = banner;
        }
        if (password) {
            user.password = bcrypt.hashSync(password, 10);
        }
        const updatedUser = yield user.save();
        const _a = updatedUser._doc, { password: sortedPassword, refreshToken, type } = _a, updatedUserInfo = __rest(_a, ["password", "refreshToken", "type"]);
        res.status(201).json(updatedUserInfo);
    }
    catch (err) {
        next(err);
    }
});
export const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        if (!userId)
            throw new HttpException(400, "User Id required...");
        const user = yield User.findById(userId).exec();
        if (!user)
            throw new HttpException(400, "User not found...");
        const result = yield user.deleteOne();
        res
            .status(200)
            .json(`UserName: ${result.userName} witt Id ${result._id} deleted...`);
    }
    catch (err) {
        next(err);
    }
});
export const findUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        if (!userId || userId === "undefined")
            return res.sendStatus(400);
        const user = yield User.findOne({
            _id: userId,
        })
            .select("-password")
            .lean();
        if (!user)
            res.status(400).json("Could not found this user...");
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});
export const getFriends = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    if (!userId)
        return res.sendStatus(400);
    try {
        const user = yield User.findById(userId).exec();
        if (!user)
            return res.status(400).json("Could not found user...");
        if (Array.isArray(user === null || user === void 0 ? void 0 : user.friends) && !(user === null || user === void 0 ? void 0 : user.friends))
            return res.status(400).json("No friends found yet...");
        res.status(200).json(user === null || user === void 0 ? void 0 : user.friends);
    }
    catch (err) {
        next(err);
    }
});
export const getSingleFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    if (!currentUserId || !friendId)
        return res.sendStatus(400);
    try {
        const user = yield User.findById(currentUserId);
        if (!user)
            throw new HttpException(400, "User not found...");
        const friend = user.friends.filter((friend) => {
            return friend._id.toString() === friendId;
        });
        const _b = friend[0], { password } = _b, friendInfo = __rest(_b, ["password"]);
        res.status(200).json(friendInfo);
    }
    catch (err) {
        next(err);
    }
});
export const removeFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const currentUserId = req.user.id;
    const friendId = (_c = req.params) === null || _c === void 0 ? void 0 : _c.friendId;
    if (!friendId || friendId === "undefined")
        return res.status(400).json("Friend Id required...");
    try {
        const currentUser = yield User.findById(currentUserId);
        const friend = yield User.findById(friendId);
        if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.friends.includes(friend))) {
            yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.updateOne({
                $pull: {
                    friends: friend,
                },
            }));
            res.sendStatus(201);
        }
        else {
            throw new HttpException(500, "Something went wrong...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const addMemo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    if (!friendId || friendId === "undefined")
        return res.status(400).json("Friend Id required...");
    try {
        const currentUser = yield User.findById(currentUserId);
        let updatedFriend;
        if (!currentUser)
            return res.status(404).json("Something went wrong in verifying...");
        if (currentUser) {
            updatedFriend = currentUser.friends.find((friend) => {
                friend._id.toString() === friendId;
            });
        }
        if (!updatedFriend)
            return res.status(404).json("Friend not found...");
        updatedFriend.memo = req.body.memo;
        currentUser.friends = currentUser.friends
            .map((friend) => {
            if (updatedFriend === undefined)
                return friend;
            return friend._id === updatedFriend._id ? updatedFriend : friend;
        })
            .filter((friend) => friend !== undefined);
        yield currentUser.save();
        return res.status(201).json({ _id: currentUser._id });
    }
    catch (err) {
        next(err);
    }
});
export const handleCloseFriends = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    if (currentUserId === "undefined" || friendId === "undefined")
        return res
            .status(400)
            .json("Friend Id or Current User Id must required...");
    try {
        const currentUser = yield User.findById(currentUserId);
        if (!currentUser)
            return res.status(404).json("User not found...");
        const findFriend = currentUser.friends.find((friend) => {
            if (friend._id.toString() === friendId) {
                return friend;
            }
        });
        if (findFriend === undefined)
            return res.status(404).json("Friend not found...");
        const updatedFriend = findFriend;
        currentUser.friends = currentUser.friends.filter((friend) => {
            friend._id.toString() !== friendId;
        });
        if (currentUser.closeFriends.some((friend) => friend._id.toString() === findFriend._id.toString())) {
            currentUser.closeFriends = currentUser.closeFriends.filter((friend) => friend._id !== updatedFriend._id);
        }
        else {
            currentUser.closeFriends.push(updatedFriend);
        }
        yield currentUser.save();
        return res.status(201).json({ _id: currentUser._id });
    }
    catch (err) {
        next(err);
    }
});
