import FriendAcceptReject from "../models/FriendRequestTable.js";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import User from "../models/User.js";
import PrivateConversation from "../models/PrivateConversation.js";

export const getAllFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.sendStatus(403);

        const requestList = await FriendAcceptReject.find({
            referenced_user: user?._id
        });
        if (Array.isArray(requestList) && !requestList?.length) {
            return res.sendStatus(404);
        }

        res.status(200).json(requestList);
    } catch (err) {
        next(err);
    }
};

export const sendFriend = async (req: Request, res: Response, next:NextFunction) => {
    const currentUserId = req.user.id;
    const { userName, tag } = req.query; 
    try {
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) return res.sendStatus(404);
        const receiver = await User.findOne({
          userName,
          tag
        });
        if (!receiver) return res.sendStatus(404);

        const requestTable = await FriendAcceptReject.findOne({
          referenced_user: receiver._id,
        });
        if (!requestTable?.table.members.includes(currentUserId as never)) {
            try {
                await requestTable?.updateOne({
                    $push: {
                        table: {
                            members: currentUser
                        }
                    }
                });
                return res.status(201).json({ _id: requestTable?._id });
            } catch (err) {
                next(err);
            }
        } else {
          return res.status(407).json("Friend request already sended...");
        }
    } catch (err) {
        next(err);
    }
};

export const handleRequestFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const senderId: string = req.params.senderId as string;
  const isAccepted: boolean = req.body.isAccepted;
  try {
    const sender = await User.findById(senderId);
    const currentUser = await User.findById(currentUserId);

    const requestTable = await FriendAcceptReject.findOne({
      referenced_user: currentUserId,
    });

    if (requestTable?.table.members.includes(senderId as never)) {
      try {
        if (isAccepted && !sender?.friends.includes(currentUserId as never)) {
          try {
            await sender?.updateOne({
              $push: { friends: currentUser },
            });
            await currentUser?.updateOne({
              $push: { friends: sender },
            });
            await requestTable.updateOne({
              $pull: {
                table: {
                  members: sender,
                },
              },
            });

            const newConversation = new PrivateConversation({
              members: [sender, currentUser],
              senderId: sender?._id,
              receiverId: currentUser?._id,
              readBySender: false,
              readByReceiver: true,
            });
            await newConversation.save();

            res.status(201).json({ newConversation, currentUser });
          } catch (err) {
            next(err);
          }
        } else {
          try {
            await requestTable.updateOne({
              $pull: {
                table: {
                  members: sender,
                },
              },
            });
            res.status(201).json("Friend request rejected...");
          } catch (err) {
            next(err);
          }
        }
      } catch (err) {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};