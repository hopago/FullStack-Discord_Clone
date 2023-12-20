import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middleware/error/utils";
import FriendAcceptReject, {
  IFriendRequestTable,
} from "../../models/FriendRequestTable";

export const getFriendRequestNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestList: IFriendRequestTable | null =
      await FriendAcceptReject.findOne({ referenced_user: req.user.id });
    if (!requestList) {
      throw new HttpException(404, "Request Docs not found...");
    }

    const notificationArr = requestList.notifications;

    let notifications: {
      senderInfo: {
        avatar: string;
        userName: string;
      };
      type: "friendRequest_send" | "friendRequest_accept";
      isRead?: boolean | undefined;
    }[];

    if (req.body.fetchType === "notSeen") {
      notifications = notificationArr.filter(
        (notification) => notification.isRead !== true
      );
    } else {
      notifications = notificationArr;
    }

    return notifications;
  } catch (err) {
    throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
  }
};
