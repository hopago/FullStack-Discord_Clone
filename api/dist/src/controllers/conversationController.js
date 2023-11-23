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
        res.status(201).json(savedConversation);
    }
    catch (err) {
        next(err);
    }
});
export const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversations = yield PrivateConversation.find({
            receiverId: req.user.id
        })
            .sort({ updatedAt: -1 });
        if (!conversations ||
            (Array.isArray(conversations) && !conversations.length))
            return res.status(400).json("No comment found yet...");
        res.status(200).json(conversations);
    }
    catch (err) {
        next(err);
    }
});
export const getSingleConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield PrivateConversation.findById(req.params.conversationId);
        if (!conversation)
            throw new HttpException(400, "Could not found this chat room...");
        res.status(200).json(conversation);
    }
    catch (err) {
        next(err);
    }
});
export const updateConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedConversation = yield PrivateConversation.findOneAndUpdate({
            _id: req.params.conversationId,
        }, {
            $set: Object.assign({}, (req.user.id
                ? {
                    readByReceiver: true
                }
                : {
                    readBySender: true
                })),
        }, {
            new: true
        });
        res.status(200).json(updatedConversation);
    }
    catch (err) {
        next(err);
    }
});
