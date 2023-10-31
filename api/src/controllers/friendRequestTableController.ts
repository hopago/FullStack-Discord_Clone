import FriendAcceptReject from "../models/FriendRequestTable.js";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import User from "../models/User.js";

export const getAllFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);
        const requestList = await FriendAcceptReject.findOne({
            referenced_user: user?._id
        });

        const requestListArr = requestList?.table.members;
        if (Array.isArray(requestListArr) && !requestListArr?.length) {
            throw new HttpException(400, "No request founded...");
        }

        res.status(200).json(requestListArr);
    } catch (err) {
        next(err);
    }
};

export const sendFriend = async (req: Request, res: Response, next:NextFunction) => {
    const currentUserId = req.user.id;
    const receiverId: string = req.params.receiverId as string;
    try {
        const currentUser = await User.findById(currentUserId);

        const requestTable = await FriendAcceptReject.findOne({
          referenced_user: receiverId,
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
                res.status(201).json("Friend request sended successfully...");
            } catch (err) {
                throw new HttpException(400, "You've been already sended request...");
            }
        };
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
            res.sendStatus(201);
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