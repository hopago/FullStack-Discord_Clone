import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middleware/error/utils.js";
import FriendAcceptReject from "../../models/FriendRequestTable.js";

export const deleteFriendRequestNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestList = await FriendAcceptReject.findOneAndUpdate({
            referenced_user: req.user.id
        }, {
            $pull: {
                notifications: {
                    userName: req.body.userName,
                    type: req.body.type
                }
            }
        }, {
            new: true
        });

        return requestList;
    } catch (err) {
        throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
    }
};