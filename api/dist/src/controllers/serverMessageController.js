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
import ServerMessage from "../models/ServerMessage.js";
import ServerConversation from "../models/ServerConversation.js";
export const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // for lazy fetching...
    const fetchCount = req.query.fetchCount;
    const childCategory = req.query.childCategory;
    if (!fetchCount) {
        try {
            const conversation = yield ServerConversation.findOne({
                messages_referenced: {
                    serverId: req.params.serverId,
                    childCategory
                }
            });
            if (!conversation)
                throw new HttpException(400, "No conversation founded...");
            const lastMessageNumber = conversation === null || conversation === void 0 ? void 0 : conversation.lastMessageNumber;
            const quantityNewMessages = 20;
            const messages = yield ServerMessage.find({
                referenced_conversation: {
                    serverId: req.params.serverId,
                    childCategory
                },
                numberOfMessage: {
                    $lt: lastMessageNumber,
                    $gte: lastMessageNumber + quantityNewMessages
                }
            });
            res.status(200).json(messages);
        }
        catch (err) {
            next(err);
        }
    }
    else {
        try {
            const conversation = yield ServerConversation.findOne({
                messages_referenced: {
                    serverId: req.params.serverId,
                    childCategory
                }
            });
            if (!conversation)
                throw new HttpException(400, "No conversation founded...");
            const lastMessageNumber = conversation === null || conversation === void 0 ? void 0 : conversation.lastMessageNumber;
            const quantityNewMessages = 20;
            const lt = lastMessageNumber - quantityNewMessages * Number(fetchCount);
            const gte = lt + quantityNewMessages;
            const messages = yield ServerMessage.find({
                referenced_conversation: {
                    serverId: req.params.serverId,
                    childCategory
                },
                numberOfMessage: {
                    $lt: lt,
                    $gte: gte
                }
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
    const childCategory = req.query.childCategory;
    try {
        const conversation = yield ServerConversation.findById(req.params.serverId);
        const lastMessageNumber = conversation === null || conversation === void 0 ? void 0 : conversation.lastMessageNumber;
        if (lastMessageNumber === undefined)
            throw new HttpException(500, "Something went wrong...");
        const newMessage = new ServerMessage(Object.assign({ referenced_conversation: {
                serverId: req.params.serverId,
                childCategory
            }, numberOfMessage: lastMessageNumber + 1 }, req.body));
        const savedMessage = yield newMessage.save();
        yield ServerConversation.findOneAndUpdate({
            messages_referenced: {
                serverId: req.params.serverId,
            },
            childCategory
        }, {
            $set: {
                lastMessageNumber: savedMessage
            }
        }, { new: true });
        res.status(201).json(savedMessage);
    }
    catch (err) {
        next(err);
    }
});
export const updatedMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield ServerMessage.findById(req.params.messageId);
        if (!message)
            throw new HttpException(400, "Could not found message...");
        if (req.user.id === message.referenced_message.author.userId) {
            const updatedMessage = yield ServerMessage.findByIdAndUpdate(req.params.messageId, {
                $set: {
                    referenced_message: Object.assign({}, req.body),
                },
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
        const message = yield ServerMessage.findById(req.params.messageId);
        if (!message)
            throw new HttpException(400, "Something went wrong...");
        if (req.user.id === message.referenced_message.author.userId) {
            yield ServerMessage.findByIdAndDelete(req.params.messageId);
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
