import { NextFunction, Request, Response } from "express";
import CloseFriend from "../../models/CloseFriend.js";
import { HttpException } from "../../middleware/error/utils.js";

export const getCloseFriendsArray = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;

  try {
    const docs = await CloseFriend.findOne({
      referencedUser: currentUserId,
    });
    if (!docs) throw new HttpException(404, "CloseFriend docs not found...");

    const { closeFriends } = docs;

    if (closeFriends.length) {
      return closeFriends;
    }
  } catch (err) {
    next(err);
  }
};