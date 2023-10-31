import ServerConversation from "../models/ServerConversation.js";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";

export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
    const serverId = req.params.serverId;
    const newConversation = new ServerConversation({
        messages_referenced: {
            serverId,
            childCategory: req.body.childCategory
        },
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
        const conversations = await ServerConversation.find({
          messages_referenced: { serverId: req.params.serverId },
        })
        .sort({ createdAt: 1 });

        res.status(200).json(conversations);
    } catch (err) {
        next(err);
    }
};

export const getSingleConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversation = await ServerConversation.findById(req.params.conversationId);
        if (!conversation) throw new HttpException(400, "Something went wrong...");

        res.status(200).json(conversation);
    } catch (err) {
        next(err);
    }
};

export const updateConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedConversation = await ServerConversation.findOneAndUpdate(
            {
                _id: req.params.conversationId
            },
            {
                $set: {
                    messages_referenced: {
                        childCategory: req.body.childCategory
                    }
                }
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