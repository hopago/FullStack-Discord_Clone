var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ServerConversation from "../models/ServerConversation.js";
import { HttpException } from "../middleware/error/utils.js";
export const createConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const serverId = req.params.serverId;
    const newConversation = new ServerConversation({
        messages_referenced: {
            serverId,
            childCategory: req.body.childCategory
        },
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
        const conversations = yield ServerConversation.find({
            messages_referenced: { serverId: req.params.serverId },
        })
            .sort({ createdAt: 1 });
        res.status(200).json(conversations);
    }
    catch (err) {
        next(err);
    }
});
export const getSingleConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield ServerConversation.findById(req.params.conversationId);
        if (!conversation)
            throw new HttpException(400, "Something went wrong...");
        res.status(200).json(conversation);
    }
    catch (err) {
        next(err);
    }
});
export const updateConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedConversation = yield ServerConversation.findOneAndUpdate({
            _id: req.params.conversationId
        }, {
            $set: {
                messages_referenced: {
                    childCategory: req.body.childCategory
                }
            }
        }, {
            new: true
        });
        res.status(200).json(updatedConversation);
    }
    catch (err) {
        next(err);
    }
});
