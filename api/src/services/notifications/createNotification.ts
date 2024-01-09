import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middleware/error/utils.js";
import FriendAcceptReject from "../../models/FriendRequestTable.js";
import User, { IUser } from "../../models/User.js";

export const createFriendRequestNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userName, tag } = req.body;

  try {
    const referredUser = await User.findOne({
      userName,
      tag,
    });
    if (!referredUser)
      return res.status(404).json("Referred User not found...");

    const requestList = await FriendAcceptReject.findOne({
      referenced_user: referredUser?._id,
    });
    if (!requestList) {
      throw new HttpException(404, "Request Docs not found...");
    }

    const sender = await User.findOne({
      _id: req.body.senderId,
    });
    if (!sender) {
      throw new HttpException(404, "User not found...");
    }

    const { avatar, userName: SenderUserName } = sender;

    const senderInfo = {
      avatar,
      userName: SenderUserName,
    };

    if (
      req.body.type !== "friendRequest_send" &&
      req.body.type !== "friendRequest_accept"
    ) {
      throw new HttpException(400, "Wrong notifications type...");
    }

    const newNotification: {
      senderInfo: {
        avatar: IUser["avatar"];
        userName: IUser["userName"];
      };
      type: "friendRequest_send" | "friendRequest_accept";
      isRead?: boolean;
      createdAt: Date
    } = {
      senderInfo,
      type: req.body.type,
      createdAt: new Date()
    };

    requestList.notifications.push(newNotification);

    await requestList.save();
  } catch (err) {
    throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
  }
};
