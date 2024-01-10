import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middleware/error/utils.js";
import FriendAcceptReject from "../../models/FriendRequestTable.js";
import { Error } from "mongoose";

export const deleteFriendRequestNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestList = await FriendAcceptReject.findOne({
        referenced_user: req.user.id
      });

      const index = requestList?.notifications.findIndex(notification => {
        return (
          notification.senderInfo.userName === req.body.userName &&
          notification.type === req.body.type
        );
      });
      if (!index) throw new HttpException(404, "Notification not found...");
  
      requestList?.notifications.splice(index, 1);

      await requestList?.save();

      return {
        status: 204
      }
    } catch (err: unknown) {
        if (err instanceof Error) {
          throw new HttpException(500, err.message)
        } else {
          throw new HttpException(500, `${err}`);
        }
    }
};