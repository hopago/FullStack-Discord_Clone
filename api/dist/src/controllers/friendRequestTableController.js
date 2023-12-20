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
import { getFriendRequestNotifications } from "../services/notifications/getNotifications.js";
import { createFriendRequestNotification } from "../services/notifications/createNotification.js";
import { deleteFriendRequestNotification } from "../services/notifications/deleteNotification.js";
import { seeFriendRequestNotification } from "../services/notifications/seeNotification.js";
{
    /* 12 05 22 40 */
}
export const getAllFriendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id);
        if (!user)
            return res.status(403).json("Something went wrong in verifying...");
        const requestList = yield FriendAcceptReject.findOne({
            referenced_user: user === null || user === void 0 ? void 0 : user._id,
        });
        if (!requestList) {
            return res.status(500).json("Something went wrong in referenced...");
        }
        return res.status(200).json(requestList);
    }
    catch (err) {
        next(err);
    }
});
export const getReceivedCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User.findById(req.user.id);
        if (!user)
            return res.status(403).json("Something went wrong in verifying...");
        const userId = user === null || user === void 0 ? void 0 : user._id.toString();
        const requestList = yield FriendAcceptReject.findOne({
            referenced_user: userId,
        });
        if (!requestList) {
            return res.status(500).json("Something went wrong in referenced...");
        }
        const receivedCount = (_a = requestList === null || requestList === void 0 ? void 0 : requestList.members) === null || _a === void 0 ? void 0 : _a.length;
        if (receivedCount === undefined)
            return res.sendStatus(500);
        return res.status(200).json({ count: receivedCount, _id: requestList._id });
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
            return res.status(400).json("Something went wrong in verifying...");
        const receiver = yield User.findOne({
            userName,
            tag,
        });
        if (!receiver)
            return res.status(400).json("Could not found receiver...");
        const receiverId = receiver._id.toString();
        const requestTable = yield FriendAcceptReject.findOne({
            referenced_user: receiverId,
        });
        if (!requestTable)
            return res
                .status(500)
                .json(`"Something went wrong in table...", ${requestTable}`);
        if (!(requestTable === null || requestTable === void 0 ? void 0 : requestTable.members.some((member) => { var _a; return ((_a = member._id) === null || _a === void 0 ? void 0 : _a.toString()) === currentUserId; }))) {
            try {
                const { _id, description, language, userName, avatar, banner } = currentUser;
                const currentUserInfo = {
                    _id,
                    description,
                    language,
                    userName,
                    avatar,
                    banner,
                };
                yield (requestTable === null || requestTable === void 0 ? void 0 : requestTable.updateOne({
                    $push: {
                        members: currentUserInfo,
                    },
                }, { new: true }));
                return res.status(201).json({
                    _id: requestTable === null || requestTable === void 0 ? void 0 : requestTable._id,
                    receiverId: receiver._id,
                    senderId: req.user.id,
                });
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
    if (!senderId)
        return res.status(400).json("Sender Id required...");
    try {
        const sender = yield User.findById(senderId);
        const currentUser = yield User.findById(currentUserId);
        if (!sender || !currentUser)
            return res.status(400).json("Cannot find that users...");
        const requestTable = yield FriendAcceptReject.findOne({
            referenced_user: currentUserId,
        });
        if (!requestTable)
            return res.status(400).json("Something went wrong in requestTable...");
        if (requestTable === null || requestTable === void 0 ? void 0 : requestTable.members.some((member) => { var _a; return ((_a = member._id) === null || _a === void 0 ? void 0 : _a.toString()) === senderId; })) {
            try {
                if (isAccepted &&
                    !(sender === null || sender === void 0 ? void 0 : sender.friends.some((friend) => { var _a; return ((_a = friend._id) === null || _a === void 0 ? void 0 : _a.toString()) === currentUserId; }))) {
                    try {
                        const { _id, description, language, userName, avatar, banner } = currentUser;
                        const currentUserInfo = {
                            _id,
                            description,
                            language,
                            userName,
                            avatar,
                            banner,
                        };
                        const { _id: senderId, description: senderDesc, language: senderLang, userName: senderName, avatar: senderAvatar, banner: senderBanner, } = sender;
                        const senderInfo = {
                            senderId,
                            senderDesc,
                            senderLang,
                            senderName,
                            senderAvatar,
                            senderBanner,
                        };
                        yield (sender === null || sender === void 0 ? void 0 : sender.updateOne({
                            $push: { friends: currentUserInfo },
                        }));
                        yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.updateOne({
                            $push: { friends: senderInfo },
                        }));
                        yield requestTable.updateOne({
                            $pull: {
                                members: {
                                    _id: sender._id,
                                },
                            },
                        });
                        const newConversation = new PrivateConversation({
                            members: [senderInfo, currentUserInfo],
                            senderId: sender === null || sender === void 0 ? void 0 : sender._id,
                            receiverId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id,
                            readBySender: false,
                            readByReceiver: true,
                        });
                        yield newConversation.save();
                        return res
                            .status(201)
                            .json({ newConversation, currentUser, requestTable });
                    }
                    catch (err) {
                        next(err);
                    }
                }
                else {
                    try {
                        yield requestTable.updateOne({
                            $pull: {
                                members: {
                                    _id: sender._id,
                                },
                            },
                        });
                        return res.status(201).json("Friend request rejected...");
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
        else {
            return res.status(400).json("Friend request not found...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const getNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield getFriendRequestNotifications(req, res, next);
        if (!notifications)
            return res
                .status(500)
                .json("Something went wrong in getNotifications...");
        return res.status(200).json(notifications);
    }
    catch (err) {
        next(err);
    }
});
export const createNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield createFriendRequestNotification(req, res, next);
        return res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
export const deleteNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedList = yield deleteFriendRequestNotification(req, res, next);
        return res.status(201).json(updatedList);
    }
    catch (err) {
        next(err);
    }
});
export const seeNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedNotification = yield seeFriendRequestNotification(req, res, next);
        if (updatedNotification) {
            return res.status(201).json(updatedNotification);
        }
    }
    catch (err) {
        next(err);
    }
});
