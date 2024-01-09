import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middleware/error/utils.js";
import FriendAcceptReject from "../../models/FriendRequestTable.js";

export const seeFriendRequestNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestList = await FriendAcceptReject.findOne({
      referenced_user: req.user.id
    });
    
    if (!requestList) return res.status(404).json("User not found...");
    
    let index = -1;
    const updatedNotification = requestList.notifications.find((notification, i) => {
      const isMatch = notification.senderInfo.userName === req.body.userName && notification.type === req.body.type;
      if (isMatch) index = i;
      return isMatch;
    });
    
    if (index === -1 || !updatedNotification) return res.status(404).json("Notification not found...");
    
    requestList.notifications.splice(index, 1, updatedNotification);
    
    await requestList.save();
    
    return updatedNotification;
  } catch (err) {
    throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
  }
};
