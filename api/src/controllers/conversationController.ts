import PrivateConversation from "../models/PrivateConversation.js";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";

export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
    const friendId = req.query.friendId;
    const newConversation = new PrivateConversation({
        members: [req.user.id, req.query.friendId],
        senderId: friendId,
        receiverId: req.user.id,
        readBySender: !req.user.id,
        readByReceiver: req.user.id
    });
    try {
        const savedConversation = await newConversation.save();

        res.status(201).json(savedConversation);
    } catch (err) {
        next(err);
    }
};

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversations = await PrivateConversation.find({
            receiverId: req.user.id
        })
        .sort({ updatedAt: - 1 });
        if (
          !conversations ||
          (Array.isArray(conversations) && !conversations.length)
        ) return res.status(400).json("No conversation found yet...");

        res.status(200).json(conversations);
    } catch (err) {
        next(err);
    }
};

export const getSingleConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversation = await PrivateConversation.findById(req.params.conversationId);
        if (!conversation) throw new HttpException(400, "Could not found this chat room...");

        res.status(200).json(conversation);
    } catch (err) {
        next(err);
    }
};

export const updateConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedConversation = await PrivateConversation.findOneAndUpdate(
          {
            _id: req.params.conversationId,
          },
          {
            $set: {
              ...(req.user.id 
                ? {
                    readByReceiver: true
                } 
                : {
                    readBySender: true
                }),
            },
          },
          {
            new: true
          }
        );

        res.status(200).json(updatedConversation);
    } catch (err) {
        next(err);
    }
};