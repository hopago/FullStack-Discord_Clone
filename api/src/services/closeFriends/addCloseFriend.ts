import { NextFunction, Request, Response } from "express";
import CloseFriend, { ICloseFriend } from "../../models/CloseFriend";
import { HttpException } from "../../middleware/error/utils";

export const addCloseFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendInfo: ICloseFriend["closeFriends"][0] = req.body;

  try {
    const docs = await CloseFriend.findOne({
      referencedUser: currentUserId,
    });
    if (!docs) {
      try {
        const newDocs = new CloseFriend({
          referencedUser: currentUserId,
          closeFriends: [friendInfo],
        });

        await newDocs.save();

        const { closeFriends } = newDocs;

        return closeFriends;
      } catch (err) {
        next(err);
      }
    } else {
      const isFriendAlreadyAdded = docs.closeFriends.some(
        (friend) => friend._id === friendInfo._id
      );

      if (isFriendAlreadyAdded) {
        throw new HttpException(409, "Friend already existed...");
      } else {
        docs.closeFriends.push(friendInfo);

        await docs.save();

        const { closeFriends } = docs;

        return closeFriends;
      }
    }
  } catch (err) {
    next(err);
  }
};
