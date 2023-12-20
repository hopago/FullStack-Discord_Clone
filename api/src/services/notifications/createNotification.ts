import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middleware/error/utils";
import FriendAcceptReject from "../../models/FriendRequestTable";
import User, { IUser } from "../../models/User";

export const createFriendRequestNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestList = await FriendAcceptReject.findOne({
            referenced_user: req.user.id
        });
        if (!requestList) {
            throw new HttpException(404, "Request Docs not found...");
        }

        const sender = await User.findOne({
            _id: req.body.senderId
        });
        if (!sender) {
            throw new HttpException(404, "User not found...");
        }

        const {
          avatar,
          userName
        } = sender;

        const senderInfo = {
            avatar,
            userName
        }

        if (
          req.body.type !== "friendRequest_send" ||
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
        } = {
          senderInfo,
          type: req.body.type,
        };

        requestList.notifications.push(newNotification);

        await requestList.save();
    } catch (err) {
        throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
    }
};