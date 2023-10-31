import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import BlackList from "../models/BlockRequestTable.js";
import User from "../models/User.js";

export const getAllBlackList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);
        const blackList = await BlackList.findOne({
            referenced_user: user?._id
        });

        const blackListArr = blackList?.table.members;
        if (Array.isArray(blackListArr) && !blackListArr?.length) {
            throw new HttpException(400, "No list founded...");
        }

        res.status(200).json(blackListArr);
    } catch (err) {
        next(err);
    }
};

export const addBlockUser = async (req: Request, res: Response, next:NextFunction) => {
    const currentUserId = req.user.id;
    const blockUserId = req.params.blockUserId;
    try {
        const blockUser = await User.findById(blockUserId);
        
        const blockRequestTable = await BlackList.findOne({
            referenced_user: currentUserId
        });
        if (!blockRequestTable?.table.members.includes(blockUser as never)) {
            await blockRequestTable?.updateOne({
              $push: {
                table: {
                  members: blockUser,
                },
              },
            });
            res.sendStatus(201);
        } else {
            throw new HttpException(500, "Something went wrong...");
        }
    } catch (err) {
        next(err);
    }
};

export const deleteBlockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const blockUserId = req.params.blockUserId;
  try {
    const blockUser = await User.findById(blockUserId);

    const blockRequestTable = await BlackList.findOne({
      referenced_user: currentUserId,
    });
    if (blockRequestTable?.table.members.includes(blockUser as never)) {
      await blockRequestTable?.updateOne({
        $pull: {
          table: {
            members: blockUser,
          },
        },
      });
      res.sendStatus(201);
    } else {
      res.status(500).json("Something went wrong...");
    }
  } catch (err) {
    next(err);
  }
};