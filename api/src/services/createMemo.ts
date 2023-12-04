import { Request, Response, NextFunction } from "express";
import Memo, { IMemo } from "../models/FriendMemo.js";
import { HttpException } from "../middleware/error/utils.js";

export const createMemo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const newMemo: IMemo = new Memo({
    referenced_user: req.user.id,
    friendId: req.params.friendId,
    memo: req.body.memo
  });

  try {
    const memo = await newMemo.save();

    return memo.toObject();
  } catch (err) {
    console.log(err);
    throw new HttpException(500, "Something went wrong in createMemo Func...");
  }
};