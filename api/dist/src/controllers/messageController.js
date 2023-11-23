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
import PrivateMessage from "../models/PrivateMessage.js";
import PrivateConversation from "../models/PrivateConversation.js";
export const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // for lazy fetching...
    const fetchCount = req.query.fetchCount;
    if (!fetchCount) {
        try {
            const conversation = yield PrivateConversation.findById(req.params.conversationId);
            if (!conversation)
                throw new HttpException(400, "No conversation founded...");
            const lastMessageNumber = conversation === null || conversation === void 0 ? void 0 : conversation.lastMessageNumber;
            const quantityNewMessages = 20;
            const messages = yield PrivateMessage.find({
                referenced_conversation: {
                    conversationId: req.params.conversationId,
                },
                numberOfMessage: {
                    $lt: lastMessageNumber,
                    $gte: lastMessageNumber + quantityNewMessages,
                },
            });
            res.status(200).json(messages);
        }
        catch (err) {
            next(err);
        }
    }
    else {
        try {
            const conversation = yield PrivateConversation.findById(req.params.conversationId);
            if (!conversation)
                throw new HttpException(400, "No conversation founded...");
            const lastMessageNumber = conversation === null || conversation === void 0 ? void 0 : conversation.lastMessageNumber;
            const quantityNewMessages = 20;
            const lt = lastMessageNumber - quantityNewMessages * Number(fetchCount);
            const gte = lt + quantityNewMessages;
            const messages = yield PrivateMessage.find({
                referenced_conversation: {
                    conversationId: req.params.conversationId,
                },
                numberOfMessage: {
                    $lt: lt,
                    $gte: gte,
                },
            });
            if (Array.isArray(messages) && messages.length < 20) {
                return res.status(200).json({ messages, lastArray: true });
            }
            res.status(200).json(messages);
        }
        catch (err) {
            next(err);
        }
    }
});
export const createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield PrivateConversation.findById(req.params.conversationId);
        const lastMessageNumber = conversation === null || conversation === void 0 ? void 0 : conversation.lastMessageNumber;
        if (lastMessageNumber === undefined)
            throw new HttpException(500, "Something went wrong...");
        const newMessage = new PrivateMessage(Object.assign({ referenced_conversation: {
                conversationId: req.params.conversationId
            }, numberOfMessage: lastMessageNumber + 1 }, req.body));
        const savedMessage = yield newMessage.save();
        yield PrivateConversation.findOneAndUpdate({
            _id: req.params.conversationId,
        }, {
            $set: {
                readByReceiver: req.user.id,
                readBySender: !req.user.id,
                lastMessage: req.body.referenced_message.content.message,
                lastMessageNumber: savedMessage.numberOfMessage,
            },
        }, { new: true });
        res.status(201).json(savedMessage);
    }
    catch (err) {
        next(err);
    }
});
export const updateMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield PrivateMessage.findById(req.params.messageId);
        if (!message)
            throw new HttpException(400, "Could not found message...");
        if (req.user.id === message.referenced_message.author.userId) {
            const updatedMessage = yield PrivateMessage.findByIdAndUpdate(req.params.messageId, {
                $set: {
                    referenced_message: Object.assign({}, req.body)
                }
            }, {
                new: true,
            });
            res.status(201).json(updatedMessage);
        }
        else {
            throw new HttpException(403, "Not authorized...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const deleteMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield PrivateMessage.findById(req.params.messageId);
        if (!message)
            throw new HttpException(400, "Something went wrong...");
        if (req.user.id === message.referenced_message.author.userId) {
            yield PrivateMessage.findByIdAndDelete(req.params.messageId);
            res.sendStatus(204);
        }
        else {
            throw new HttpException(403, "Not authorized...");
        }
    }
    catch (err) {
        next(err);
    }
});
