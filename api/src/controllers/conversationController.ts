import PrivateConversation, { IPrivateConversation } from "../models/PrivateConversation.js";
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

        return res.status(201).json(savedConversation);
    } catch (err) {
        next(err);
    }
};

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversations = await PrivateConversation.find({
            $or: [
                { receiverId: req.user.id },
                { senderId: req.user.id }
            ]
        })
        .sort({ updatedAt: - 1 });
        if (
          !conversations ||
          (Array.isArray(conversations) && !conversations.length)
        ) return res.status(400).json("No conversation found yet...");

        return res.status(200).json(conversations);
    } catch (err) {
        next(err);
    }
};

export const getSingleConversation = async (req: Request, res: Response, next: NextFunction) => {
    const conversationId = req.params.conversationId;
    if (!conversationId) return res.sendStatus(400);
    try {
        const conversation = await PrivateConversation.findById(req.params.conversationId);
        if (!conversation) throw new HttpException(400, "Could not found this chat room...");

        return res.status(200).json(conversation);
    } catch (err) {
        next(err);
    }
};

export const getConversationByMemberId = async(req: Request, res: Response, next: NextFunction) => {
    const currUserId = req.user.id;
    const friendId = req.query.friendId;
    if (!currUserId || !friendId) return res.sendStatus(400);

    try {
        const foundConversation = await PrivateConversation.findOne({
          $and: [
            { members: { $elemMatch: { _id: currUserId } } },
            { members: { $elemMatch: { _id: friendId } } },
          ],
        });
        if (!foundConversation) return res.status(404).json("Conversation not found...");

        return res.status(200).json(foundConversation);
    } catch (err) {
        next(err);
    }
};

export const updateConversation = async (req: Request, res: Response, next: NextFunction) => {
    const conversationId = req.params.conversationId;
    const currUserId = req.user.id;
    if (!conversationId || !currUserId) return res.sendStatus(400);

    try {
        const updatedConversation:IPrivateConversation | null = await PrivateConversation.findOne({
            _id: conversationId
        });
        if (!updateConversation) return res.status(404).json("Conversation not found...");

        const validateUser = updatedConversation?.members.some(member => member._id === currUserId);
        if (!validateUser) return res.sendStatus(405);

        updatedConversation?.updateOne(
          {
            $set: {
              ...(req.user.id
                ? {
                    readByReceiver: true,
                  }
                : {
                    readBySender: true,
                  }),
            },
          },
          {
            new: true,
          }
        );

        return res.status(200).json(updatedConversation);
    } catch (err) {
        next(err);
    }
};

export const deleteConversation = async(req: Request, res: Response, next: NextFunction) => {
    const conversationId = req.params.conversationId;
    const currUserId = req.user.id;
    if (!conversationId || !currUserId) return res.sendStatus(400);
    try {
        if (req.body.type !== "block") return res.sendStatus(405);

        await PrivateConversation.findOneAndDelete({
          _id: conversationId,
        });

        return res.status(201).json({ _id: conversationId });
    } catch (err) {
        next(err);
    }
};