var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FriendAcceptReject from "../models/FriendRequestTable.js";
import { HttpException } from "../middleware/error/utils.js";
import User from "../models/User.js";
export const getAllFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id);
        const requestList = yield FriendAcceptReject.findOne({
            referenced_user: user === null || user === void 0 ? void 0 : user._id
        });
        const requestListArr = requestList === null || requestList === void 0 ? void 0 : requestList.table.members;
        if (Array.isArray(requestListArr) && !(requestListArr === null || requestListArr === void 0 ? void 0 : requestListArr.length)) {
            throw new HttpException(400, "No request founded...");
        }
        res.status(200).json(requestListArr);
    }
    catch (err) {
        next(err);
    }
});
export const sendFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const receiverId = req.params.receiverId;
    try {
        const currentUser = yield User.findById(currentUserId);
        const requestTable = yield FriendAcceptReject.findOne({
            referenced_user: receiverId,
        });
        if (!(requestTable === null || requestTable === void 0 ? void 0 : requestTable.table.members.includes(currentUserId))) {
            try {
                yield (requestTable === null || requestTable === void 0 ? void 0 : requestTable.updateOne({
                    $push: {
                        table: {
                            members: currentUser
                        }
                    }
                }));
                res.status(201).json("Friend request sended successfully...");
            }
            catch (err) {
                throw new HttpException(400, "You've been already sended request...");
            }
        }
        ;
    }
    catch (err) {
        next(err);
    }
});
export const handleRequestFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const senderId = req.params.senderId;
    const isAccepted = req.body.isAccepted;
    try {
        const sender = yield User.findById(senderId);
        const currentUser = yield User.findById(currentUserId);
        const requestTable = yield FriendAcceptReject.findOne({
            referenced_user: currentUserId,
        });
        if (requestTable === null || requestTable === void 0 ? void 0 : requestTable.table.members.includes(senderId)) {
            try {
                if (isAccepted && !(sender === null || sender === void 0 ? void 0 : sender.friends.includes(currentUserId))) {
                    try {
                        yield (sender === null || sender === void 0 ? void 0 : sender.updateOne({
                            $push: { friends: currentUser },
                        }));
                        yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.updateOne({
                            $push: { friends: sender },
                        }));
                        res.sendStatus(201);
                    }
                    catch (err) {
                        next(err);
                    }
                }
                else {
                    try {
                        yield requestTable.updateOne({
                            $pull: {
                                table: {
                                    members: sender,
                                },
                            },
                        });
                        res.status(201).json("Friend request rejected...");
                    }
                    catch (err) {
                        next(err);
                    }
                }
            }
            catch (err) {
                next(err);
            }
        }
    }
    catch (err) {
        next(err);
    }
});
