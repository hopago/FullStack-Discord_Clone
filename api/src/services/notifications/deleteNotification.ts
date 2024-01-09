import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middleware/error/utils.js";
import FriendAcceptReject from "../../models/FriendRequestTable.js";

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
      if (!index) return res.status(404).json("Notification not found...");
  
      requestList?.notifications.splice(index, 1);

      await requestList?.save();

      return {
        status: 204
      }
    } catch (err) {
        return res.status(500).json(err);
    }
};