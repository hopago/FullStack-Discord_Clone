import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import ServerMessage from "../models/ServerMessage.js";
import ServerConversation from "../models/ServerConversation.js";
import { TServerMessage } from "../models/type/ServerMessage.js";

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    // for lazy fetching...
    const fetchCount = req.query.fetchCount;
    const childCategory = req.query.childCategory;

    if (!fetchCount) {
        try {
            const conversation = await ServerConversation.findOne({
                messages_referenced: {
                    serverId: req.params.serverId,
                    childCategory
                }
            });
            if (!conversation) throw new HttpException(400, "No conversation founded...");

            const lastMessageNumber = conversation?.lastMessageNumber;
            const quantityNewMessages = 20;

            const messages = await ServerMessage.find({
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
        } catch (err) {
            next(err);
        }
    } else {
        try {
            const conversation = await ServerConversation.findOne({
                messages_referenced: {
                    serverId: req.params.serverId,
                    childCategory
                }
            });
            if (!conversation) throw new HttpException(400, "No conversation founded...");

            const lastMessageNumber = conversation?.lastMessageNumber;
            const quantityNewMessages = 20;

            const lt = lastMessageNumber - quantityNewMessages * Number(fetchCount);
            const gte = lt + quantityNewMessages;

            const messages = await ServerMessage.find({
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
        } catch (err) {
            next(err);
        }
    }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    const childCategory = req.query.childCategory;
    try {
        const conversation = await ServerConversation.findById(req.params.serverId);
        const lastMessageNumber = conversation?.lastMessageNumber;
        if (lastMessageNumber === undefined) throw new HttpException(500, "Something went wrong...");

        const newMessage = new ServerMessage({
            referenced_conversation: {
                serverId: req.params.serverId,
                childCategory
            },
            numberOfMessage: lastMessageNumber + 1,
            ...req.body
        });

        const savedMessage: TServerMessage = await newMessage.save();

        await ServerConversation.findOneAndUpdate(
            {
                messages_referenced: {
                    serverId: req.params.serverId,
                },
                childCategory
            },
            {
                $set: {
                    lastMessageNumber: savedMessage
                }
            },
            { new: true }
        );

        res.status(201).json(savedMessage);
    } catch (err) {
        next(err);
    }
};

export const updatedMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = await ServerMessage.findById(req.params.messageId);
        if (!message) throw new HttpException(400, "Could not found message...");

        if (req.user.id === message.referenced_message.author.userId) {
            const updatedMessage = await ServerMessage.findByIdAndUpdate(
              req.params.messageId,
              {
                $set: {
                  referenced_message: {
                    ...req.body,
                  },
                },
              },
              {
                new: true,
              }
            );

            res.status(201).json(updatedMessage);
        } else {
            throw new HttpException(403, "Not authorized...");
        }
    } catch (err) {
        next(err);
    }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = await ServerMessage.findById(req.params.messageId);
        if (!message) throw new HttpException(400, "Something went wrong...");

        if (req.user.id === message.referenced_message.author.userId) {
            await ServerMessage.findByIdAndDelete(req.params.messageId);

            res.sendStatus(204);
        } else {
            throw new HttpException(403, "Not authorized...");
        }
    } catch (err) {
        next(err);
    }
};