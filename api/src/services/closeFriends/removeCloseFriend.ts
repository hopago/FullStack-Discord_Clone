import { NextFunction, Request, Response } from "express";
import CloseFriend from "../../models/CloseFriend.js";
import { HttpException } from "../../middleware/error/utils.js";

export const removeCloseFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendId = req.params.friendId;

  if (!friendId) throw new HttpException(400, "Friend Id required...");

  try {
    const docs = await CloseFriend.findOne({
      referencedUser: currentUserId,
    });
    if (!docs) throw new HttpException(404, "CloseFriend docs not found...");

    const { closeFriends } = docs;

    const index = closeFriends.findIndex((friend) => friend._id === friendId);
    if (index === -1) throw new HttpException(404, "CloseFriend not found...");

    closeFriends.splice(index, 1);

    await docs.save();

    return closeFriends;
  } catch (err) {
    next(err);
  }
};
