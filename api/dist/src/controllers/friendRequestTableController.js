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
import User from "../models/User.js";
import PrivateConversation from "../models/PrivateConversation.js";
export const getAllFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id);
        if (!user)
            return res.sendStatus(403);
        const requestList = yield FriendAcceptReject.find({
            referenced_user: user === null || user === void 0 ? void 0 : user._id
        });
        if (Array.isArray(requestList) && !(requestList === null || requestList === void 0 ? void 0 : requestList.length)) {
            return res.sendStatus(404);
        }
        res.status(200).json(requestList);
    }
    catch (err) {
        next(err);
    }
});
export const sendFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const { userName, tag } = req.query;
    try {
        const currentUser = yield User.findById(currentUserId);
        if (!currentUser)
            return res.sendStatus(404);
        const receiver = yield User.findOne({
            userName,
            tag
        });
        if (!receiver)
            return res.sendStatus(404);
        const requestTable = yield FriendAcceptReject.findOne({
            referenced_user: receiver._id,
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
                return res.status(201).json({ _id: requestTable === null || requestTable === void 0 ? void 0 : requestTable._id });
            }
            catch (err) {
                next(err);
            }
        }
        else {
            return res.status(407).json("Friend request already sended...");
        }
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
                        yield requestTable.updateOne({
                            $pull: {
                                table: {
                                    members: sender,
                                },
                            },
                        });
                        const newConversation = new PrivateConversation({
                            members: [sender, currentUser],
                            senderId: sender === null || sender === void 0 ? void 0 : sender._id,
                            receiverId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id,
                            readBySender: false,
                            readByReceiver: true,
                        });
                        yield newConversation.save();
                        res.status(201).json({ newConversation, currentUser });
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
