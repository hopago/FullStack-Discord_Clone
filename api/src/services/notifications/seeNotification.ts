import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middleware/error/utils.js";
import FriendAcceptReject from "../../models/FriendRequestTable.js";

export const seeFriendRequestNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestList = await FriendAcceptReject.findOneAndUpdate(
      {
        referenced_user: req.user.id,
        "notifications.senderInfo.userName": req.body.userName,
      },
      {
        $set: {
          "notifications.$[elem].isRead": true,
        },
      },
      {
        arrayFilters: [
          {
            "elem.type": {
              $in: ["friendRequest_send", "friendRequest_accept"],
            },
          },
        ],
        new: true,
      }
    );

    return requestList;
  } catch (err) {
    throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
  }
};
