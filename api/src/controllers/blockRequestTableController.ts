import { Request, Response, NextFunction } from "express";
import BlackList from "../models/BlockRequestTable.js";
import User from "../models/User.js";

{/* 12 05 22 40 */}

export const getAllBlackList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json("Something went wrong in verifying...");

        const blackList = await BlackList.findOne({
            referenced_user: user?._id
        });
        if (!blackList) return res.status(404).json("Request docs not found...");

        const blackListArr = blackList.members;
        if (!blackListArr.length) return res.sendStatus(400);

        return res.status(200).json(blackList);
    } catch (err) {
        next(err);
    }
};

export const addBlockUser = async (req: Request, res: Response, next:NextFunction) => {
    const currentUserId = req.user.id;
    const blockUserId = req.params.blockUserId;
    if (!currentUserId || !blockUserId) return res.status(400).json("Something went wrong in credentials...");

    try {
        const blockUser = await User.findById(blockUserId);
        if (!blockUser) return res.status(404).json("User not found...");
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) return res.status(404).json("User not found...");

        const {
          _id,
          avatar,
          userName,
        } = blockUser;
        const blockUserInfo = {
          _id,
          avatar,
          userName
        }

        const isFriendExisted = currentUser.friends.length && currentUser.friends.some(friend => friend._id.toString() === blockUserId);

        const blackList = await BlackList.findOne({
            referenced_user: currentUserId
        });
        if (!blackList) return res.status(404).json("Request docs not found...");

        if (
          !blackList.members.some(
            (member) => member._id.toString() === blockUserId
          )
        ) {
          await blackList?.updateOne({
            $push: {
              members: blockUserInfo
            },
          });

          if (isFriendExisted) {
            const findIndex = currentUser.friends.findIndex(friend => friend._id.toString() === blockUserId);
            currentUser.friends.splice(findIndex, 1);
            await currentUser.save();
          }

          return res.status(201).json({ _id: blackList._id });
        } else {
          return res.status(500).json("Something went wrong in members array...");
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
  if (!currentUserId || !blockUserId) return res.status(400).json("Something went wrong in credentials...");
  try {
    const blockUser = await User.findById(blockUserId);
    if (!blockUser) return res.status(404).json("User not found...");

    const blackList = await BlackList.findOne({
      referenced_user: currentUserId,
    });
    if(!blackList) return res.status(404).json("Request docs not found...");

    if (
      blackList.members.some((member) => member._id.toString() === blockUserId)
    ) {
      try {
        await blackList?.updateOne({
          $pull: {
            members: {
              _id: blockUserId,
            },
          },
        });

        return res.status(201).json({ _id: blackList._id });
      } catch (err) {
        next(err);
      }
    } else {
      res.status(500).json("Something went wrong in members array...");
    }
  } catch (err) {
    next(err);
  }
};