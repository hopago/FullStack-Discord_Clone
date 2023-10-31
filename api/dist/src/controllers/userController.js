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
import User from "../models/User.js";
import bcrypt from 'bcrypt';
export const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const user = yield User.findById(userId).select('-password').lean();
        res.status(200).json(user);
    }
    catch (err) {
        next(err);
    }
});
export const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const { userName, description, language, avatar, password } = req.body;
        if (!userName || !description || !language)
            throw new HttpException(400, "All fields except avatar&password are required...");
        const user = yield User.findById(userId).exec();
        if (!user)
            throw new HttpException(404, "User has not founded...");
        user.userName = userName;
        user.description = description;
        user.language = language;
        if (avatar) {
            user.avatar = avatar;
        }
        if (password) {
            user.password = bcrypt.hashSync(password, 10);
        }
        const updatedUser = yield user.save();
        res.status(201).json(`${updatedUser.userName} has been updated...`);
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
            throw new HttpException(404, "User not found...");
        const result = yield user.deleteOne();
        res
            .status(200)
            .json(`UserName: ${result.userName} witt Id ${result._id} deleted...`);
    }
    catch (err) {
        next(err);
    }
});
export const getFriends = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        if (!userId)
            throw new HttpException(400, "User Id required...");
        const user = yield User.findById(userId).exec();
        if (!user)
            throw new HttpException(404, "User not found...");
        const getAllPromise = (promises) => Promise.all(promises);
        const getAllFriends = user === null || user === void 0 ? void 0 : user.friends.map((friendId) => User.findById(friendId));
        const friends = yield getAllPromise(getAllFriends);
        let friendList = [];
        friends.map((friend) => {
            const { _id, userName, avatar, description, language } = friend;
            friendList.push({ _id, userName, avatar, description, language });
        });
        res.status(200).json(friendList);
    }
    catch (err) {
        next(err);
    }
});
export const getSingleFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    try {
        const user = yield User.findById(currentUserId);
        if (!user)
            throw new HttpException(404, "User not found...");
        const foundFriend = user.friends.filter((friend) => {
            return friend._id === friendId;
        });
        res.status(200).json(foundFriend);
    }
    catch (err) {
        next(err);
    }
});
export const removeFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentUserId = req.user.id;
    const friendId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.friendId;
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
