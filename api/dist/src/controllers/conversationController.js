var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PrivateConversation from "../models/PrivateConversation.js";
import { HttpException } from "../middleware/error/utils.js";
export const createConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const friendId = req.query.friendId;
    const newConversation = new PrivateConversation({
        members: [req.user.id, req.query.friendId],
        senderId: friendId,
        receiverId: req.user.id,
        readBySender: !req.user.id,
        readByReceiver: req.user.id
    });
    try {
        const savedConversation = yield newConversation.save();
        return res.status(201).json(savedConversation);
    }
    catch (err) {
        next(err);
    }
});
export const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversations = yield PrivateConversation.find({
            $or: [
                { receiverId: req.user.id },
                { senderId: req.user.id }
            ]
        })
            .sort({ updatedAt: -1 });
        if (!conversations ||
            (Array.isArray(conversations) && !conversations.length))
            return res.status(400).json("No conversation found yet...");
        return res.status(200).json(conversations);
    }
    catch (err) {
        next(err);
    }
});
export const getSingleConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.conversationId;
    if (!conversationId)
        return res.sendStatus(400);
    try {
        const conversation = yield PrivateConversation.findById(req.params.conversationId);
        if (!conversation)
            throw new HttpException(400, "Could not found this chat room...");
        return res.status(200).json(conversation);
    }
    catch (err) {
        next(err);
    }
});
export const getConversationByMemberId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currUserId = req.user.id;
    const friendId = req.query.friendId;
    if (!currUserId || !friendId)
        return res.sendStatus(400);
    try {
        const foundConversation = yield PrivateConversation.findOne({
            $and: [
                { members: { $elemMatch: { _id: currUserId } } },
                { members: { $elemMatch: { _id: friendId } } },
            ],
        });
        if (!foundConversation)
            return res.status(404).json("Conversation not found...");
        return res.status(200).json(foundConversation);
    }
    catch (err) {
        next(err);
    }
});
export const updateConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.conversationId;
    const currUserId = req.user.id;
    if (!conversationId || !currUserId)
        return res.sendStatus(400);
    try {
        const updatedConversation = yield PrivateConversation.findOne({
            _id: conversationId
        });
        if (!updateConversation)
            return res.status(404).json("Conversation not found...");
        const validateUser = updatedConversation === null || updatedConversation === void 0 ? void 0 : updatedConversation.members.some(member => member._id === currUserId);
        if (!validateUser)
            return res.sendStatus(405);
        updatedConversation === null || updatedConversation === void 0 ? void 0 : updatedConversation.updateOne({
            $set: Object.assign({}, (req.user.id
                ? {
                    readByReceiver: true,
                }
                : {
                    readBySender: true,
                })),
        }, {
            new: true,
        });
        return res.status(200).json(updatedConversation);
    }
    catch (err) {
        next(err);
    }
});
export const deleteConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.conversationId;
    const currUserId = req.user.id;
    if (!conversationId || !currUserId)
        return res.sendStatus(400);
    try {
        if (req.body.type !== "block")
            return res.sendStatus(405);
        yield PrivateConversation.findOneAndDelete({
            _id: conversationId,
        });
        return res.status(201).json({ _id: conversationId });
    }
    catch (err) {
        next(err);
    }
});
