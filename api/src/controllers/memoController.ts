import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { createMemo } from "../services/createMemo.js";
import Memo from "../models/FriendMemo.js";

export const addMemo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendId = req.params.friendId;
  if (!friendId || friendId === "undefined")
    return res.status(400).json("Friend Id required...");

  try {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser)
      return res.status(404).json("Something went wrong in verifying...");

    const isFriendExisted = await User.findById(friendId);
    if (!isFriendExisted)
      return res.status(404).json("Something went wrong in friendId...");

    const memo = await createMemo(req, res, next);

    return res.status(200).json(memo);
  } catch (err) {
    next(err);
  }
};

export const getMemo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendId = req.params.friendId;
  if (!currentUserId || !friendId || friendId === "undefined")
    return res.sendStatus(400).json("Something went wrong in creds...");

  try {
    const memo = await Memo.findOne({
      referenced_user: currentUserId,
      friendId,
    });
    if (!memo) return res.status(404).json("Memo not found...");

    return res.status(200).json(memo);
  } catch (err) {
    next(err);
  }
};

export const updateMemo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendId = req.params.friendId;
  if (!currentUserId || !friendId)
    return res.sendStatus(400).json("Something went wrong in creds...");

  try {
    const updatedMemo = await Memo.findOneAndUpdate(
      {
        referenced_user: currentUserId,
        friendId,
      },
      {
        $set: {
          memo: req.body.memo,
        },
      },
      {
        new: true,
      }
    );
    if (!updateMemo)
      return res.status(500).json("Something went wrong in updating memo...");

    return res.status(201).json(updatedMemo);
  } catch (err) {
    next(err);
  }
};

export const deleteMemo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendId = req.params.friendId;
  if (!currentUserId || !friendId || friendId === "undefined")
    return res.sendStatus(400).json("Something went wrong in creds...");

  try {
    const memo = await Memo.findOneAndDelete({
      referenced_user: currentUserId,
      friendId,
    });
    if (!memo) return res.status(404).json("Memo not found...");

    return res.status(204);
  } catch (err) {
    next(err);
  }
};
