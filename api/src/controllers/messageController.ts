import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import PrivateMessage from "../models/PrivateMessage.js";
import PrivateConversation from "../models/PrivateConversation.js";
import User from "../models/User.js";

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fetchCount = req.query.fetchCount || 0;
  const { conversationId } = req.params;

  if (!conversationId)
    return res.status(400).json("Conversation Id required...");

  try {
    const conversation = await PrivateConversation.findById(conversationId);
    if (!conversation)
      throw new HttpException(400, "No conversation founded...");

    const lastMessageNumber = conversation?.lastMessageNumber;
    const quantityNewMessages = 20;

    const lt = lastMessageNumber - quantityNewMessages * Number(fetchCount);
    const gte = lt + quantityNewMessages;

    try {
      const messages = await PrivateMessage.find({
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

          return { referenced_message, author, _id }
        });

        return res.status(200).json({ ...filteredMessages, canNextPage: false });
      }

      return res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId } = req.params;
  if (!conversationId)
    return res.status(404).json("Conversation Id required...");

  try {
    const conversation = await PrivateConversation.findById(conversationId);

    const foundAuthor = await User.findById(req.user.id);

    const lastMessageNumber = conversation?.lastMessageNumber;
    if (lastMessageNumber === undefined)
      throw new HttpException(500, "Something went wrong...");

    const newMessage = new PrivateMessage({
      referenced_conversation: {
        conversationId,
      },
      numberOfMessage: lastMessageNumber + 1,
      referenced_message: {
        ...req.body,
      },
      author: {
        authorId: req.user.id,
        userName: foundAuthor?.userName,
        avatar: foundAuthor?.avatar,
      },
    });

    const savedMessage = await newMessage.save();

    await PrivateConversation.findOneAndUpdate(
      {
        _id: req.params.conversationId,
      },
      {
        $set: {
          readByReceiver: false,
          readBySender: true,
          lastMessage: req.body.content.message,
          lastMessageNumber: savedMessage.numberOfMessage,
        },
      },
      { new: true }
    );

    const { referenced_message, author, _id } = savedMessage;

    return res.status(201).json({ referenced_message, author, _id });
  } catch (err) {
    next(err);
  }
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await PrivateMessage.findById(req.params.messageId);
    if (!message) throw new HttpException(400, "Could not found message...");

    if (req.user.id === message.author.authorId.toString()) {
      const updatedMessage = await PrivateMessage.findByIdAndUpdate(
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
      if (!updatedMessage) return res.status(500).json("Something went wrong in updated message...");

      const { referenced_message, author, _id } = updatedMessage;

      return res.status(201).json({ referenced_message, author, _id });
    } else {
      throw new HttpException(403, "Not authorized...");
    }
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await PrivateMessage.findById(req.params.messageId);
    if (!message) throw new HttpException(400, "Something went wrong...");

    if (req.user.id === message.author.authorId.toString()) {
      await PrivateMessage.findByIdAndDelete(req.params.messageId);

      return res.sendStatus(204);
    } else {
      throw new HttpException(403, "Not authorized...");
    }
  } catch (err) {
    next(err);
  }
};
