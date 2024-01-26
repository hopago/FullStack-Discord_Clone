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
import User from "../models/User.js";
export const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fetchCount = req.query.fetchCount || 0;
    const { conversationId } = req.params;
    if (!conversationId)
        return res.status(400).json("Conversation Id required...");
    try {
        const conversation = yield PrivateConversation.findById(conversationId);
        if (!conversation)
            throw new HttpException(400, "No conversation founded...");
        const lastMessageNumber = conversation === null || conversation === void 0 ? void 0 : conversation.lastMessageNumber;
        const quantityNewMessages = 20;
        const lt = lastMessageNumber - quantityNewMessages * Number(fetchCount);
        const gte = lt + quantityNewMessages;
        try {
            const messages = yield PrivateMessage.find({
                referenced_conversation: {
                    conversationId,
                },
                numberOfMessage: {
                    $lt: lt,
                    $gte: gte,
                },
            });
            if (Array.isArray(messages) && messages.length < 20) {
                const filteredMessages = messages.map((message) => {
                    const { referenced_message, author, _id } = message;
                    return { referenced_message, author, _id };
                });
                return res.status(200).json(Object.assign(Object.assign({}, filteredMessages), { canNextPage: false }));
            }
            return res.status(200).json(messages);
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
});
export const createMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.params;
    if (!conversationId)
        return res.status(404).json("Conversation Id required...");
    try {
        const conversation = yield PrivateConversation.findById(conversationId);
        const foundAuthor = yield User.findById(req.user.id);
        const lastMessageNumber = conversation === null || conversation === void 0 ? void 0 : conversation.lastMessageNumber;
        if (lastMessageNumber === undefined)
            throw new HttpException(500, "Something went wrong...");
        const newMessage = new PrivateMessage({
            referenced_conversation: {
                conversationId,
            },
            numberOfMessage: lastMessageNumber + 1,
            referenced_message: Object.assign({}, req.body),
            author: {
                authorId: req.user.id,
                userName: foundAuthor === null || foundAuthor === void 0 ? void 0 : foundAuthor.userName,
                avatar: foundAuthor === null || foundAuthor === void 0 ? void 0 : foundAuthor.avatar,
            },
        });
        const savedMessage = yield newMessage.save();
        yield PrivateConversation.findOneAndUpdate({
            _id: req.params.conversationId,
        }, {
            $set: {
                readByReceiver: false,
                readBySender: true,
                lastMessage: req.body.content.message,
                lastMessageNumber: savedMessage.numberOfMessage,
            },
        }, { new: true });
        const { referenced_message, author, _id } = savedMessage;
        return res.status(201).json({ referenced_message, author, _id });
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
        if (req.user.id === message.author.authorId.toString()) {
            const updatedMessage = yield PrivateMessage.findByIdAndUpdate(req.params.messageId, {
                $set: {
                    referenced_message: Object.assign({}, req.body),
                },
            }, {
                new: true,
            });
            if (!updatedMessage)
                return res.status(500).json("Something went wrong in updated message...");
            const { referenced_message, author, _id } = updatedMessage;
            return res.status(201).json({ referenced_message, author, _id });
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
        if (req.user.id === message.author.authorId.toString()) {
            yield PrivateMessage.findByIdAndDelete(req.params.messageId);
            return res.sendStatus(204);
        }
        else {
            throw new HttpException(403, "Not authorized...");
        }
    }
    catch (err) {
        next(err);
    }
});
