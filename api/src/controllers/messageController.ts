import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import PrivateMessage from "../models/PrivateMessage.js";
import PrivateConversation from "../models/PrivateConversation.js";

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    // for lazy fetching...
    const fetchCount = req.query.fetchCount;

    if (!fetchCount) {
      try {
        const conversation = await PrivateConversation.findById(
          req.params.conversationId
        );
        if (!conversation)
          throw new HttpException(400, "No conversation founded...");

        const lastMessageNumber = conversation?.lastMessageNumber;
        const quantityNewMessages = 20;

        const messages = await PrivateMessage.find({
          referenced_conversation: {
            conversationId: req.params.conversationId,
          },
          numberOfMessage: {
            $lt: lastMessageNumber,
            $gte: lastMessageNumber + quantityNewMessages,
          },
        });

        res.status(200).json(messages);
      } catch (err) {
        next(err);
      }
    } else {
      try {
        const conversation = await PrivateConversation.findById(
          req.params.conversationId
        );
        if (!conversation)
          throw new HttpException(400, "No conversation founded...");

        const lastMessageNumber = conversation?.lastMessageNumber;
        const quantityNewMessages = 20;

        const lt = lastMessageNumber - quantityNewMessages * Number(fetchCount);
        const gte = lt + quantityNewMessages;

        const messages = await PrivateMessage.find({
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
      } catch (err) {
        next(err);
      }
    }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversation = await PrivateConversation.findById(req.params.conversationId);
        const lastMessageNumber = conversation?.lastMessageNumber;
        if (lastMessageNumber === undefined) throw new HttpException(500, "Something went wrong...");

        const newMessage = new PrivateMessage({
            referenced_conversation: {
                conversationId: req.params.conversationId
            },
            numberOfMessage: lastMessageNumber + 1,
            ...req.body
        });

        const savedMessage = await newMessage.save();

        await PrivateConversation.findOneAndUpdate(
          {
            _id: req.params.conversationId,
          },
          {
            $set: {
              readByReceiver: req.user.id,
              readBySender: !req.user.id,
              lastMessage: req.body.referenced_message.content.message,
              lastMessageNumber: savedMessage.numberOfMessage,
            },
          },
          { new: true }
        );

        res.status(201).json(savedMessage);
    } catch (err) {
        next(err);
    }
};

export const updateMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = await PrivateMessage.findById(req.params.messageId);
        if (!message) throw new HttpException(400, "Could not found message...");

        if (req.user.id === message.referenced_message.author.userId) {
            const updatedMessage = await PrivateMessage.findByIdAndUpdate(
              req.params.messageId,
              {
                $set: {
                  referenced_message: {
                    ...req.body
                  }
                }
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
        const message = await PrivateMessage.findById(req.params.messageId);
        if (!message) throw new HttpException(400, "Something went wrong...");

        if (req.user.id === message.referenced_message.author.userId) {
            await PrivateMessage.findByIdAndDelete(req.params.messageId);

            res.sendStatus(204);
        } else {
            throw new HttpException(403, "Not authorized...");
        }
    } catch (err) {
        next(err);
    }
};