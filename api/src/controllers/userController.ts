import { HttpException } from "../middleware/error/utils.js";
import User, { IUser } from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import PrivateConversation from "../models/PrivateConversation.js";

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  try {
    const user = await User.findOne({
      _id: userId,
    })
      .select("-password")
      .lean();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  try {
    const { userName, description, language, avatar, password, banner } =
      req.body;
    if (!userName) return res.sendStatus(400);

    const user = await User.findById(userId).exec();
    if (!user) return res.status(400).json("Could not found user...");

    user.userName = userName;
    user.description = description;
    user.language = language;

    if (avatar) {
      user.avatar = avatar;
    }
    if (banner) {
      user.banner = banner;
    }
    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await user.save();

    const {
      password: sortedPassword,
      refreshToken,
      type,
      ...updatedUserInfo
    } = updatedUser._doc;

    res.status(201).json(updatedUserInfo);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  try {
    if (!userId) throw new HttpException(400, "User Id required...");

    const user = await User.findById(userId).exec();
    if (!user) throw new HttpException(400, "User not found...");

    const result = await user.deleteOne();

    res
      .status(200)
      .json(`UserName: ${result.userName} witt Id ${result._id} deleted...`);
  } catch (err) {
    next(err);
  }
};

export const findUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;
  try {
    if (!userId || userId === "undefined") return res.sendStatus(400);

    const user = await User.findOne({
      _id: userId,
    })
      .select("-password")
      .lean();
    if (!user) res.status(400).json("Could not found this user...");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  if (!userId) return res.sendStatus(400);
  try {
    const user = await User.findById(userId).exec();
    if (!user) return res.status(400).json("Could not found user...");

    if (Array.isArray(user?.friends) && !user?.friends) return res.status(400).json("No friends found yet...");

    res.status(200).json(user?.friends);
  } catch (err) {
    next(err);
  }
};

export const getSingleFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendId = req.params.friendId;
  if (!currentUserId || !friendId) return res.sendStatus(400);
  try {
    const user = await User.findById(currentUserId);
    if (!user) throw new HttpException(400, "User not found...");

    const friend: IUser[] = user.friends.filter((friend: IUser) => {
        return friend._id.toString() === friendId;
    });

    const { password, ...friendInfo } = friend[0];

    res.status(200).json(friendInfo);
  } catch (err) {
    next(err);
  }
};

export const removeFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendId = req.params?.friendId;
  if (!friendId || friendId === "undefined") return res.status(400).json("Friend Id required...");
  try {
    const currentUser = await User.findById(currentUserId);
    const friend = await User.findById(friendId);

    if (!currentUser?.friends.includes(friend as never)) {
      try {
        await currentUser?.updateOne({
          $pull: {
            "friends._id": friend?._id.toString(),
          },
        });
      } catch (err) {
        return res.status(500).json(err);
      }

      try {
        await PrivateConversation.findOneAndDelete({
          "members._id": [currentUser?._id.toString(), friend?._id.toString()]
        });
      } catch (err) {
        return res.status(500).json(err);
      }

      return res.sendStatus(204);
    } else {
      return res.sendStatus(500);
    }
  } catch (err) {
    next(err);
  }
};

export const handleCloseFriends = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const friendId = req.params.friendId;
  if (currentUserId === "undefined" || friendId === "undefined")
    return res
      .status(400)
      .json("Friend Id or Current User Id must required...");

  try {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json("User not found...");

    const findFriend = currentUser.friends.find((friend: IUser) => {
      if (friend._id.toString() === friendId) {
        return friend;
      }
    });

    if (findFriend === undefined)
      return res.status(404).json("Friend not found...");
    const updatedFriend: IUser = findFriend;

    currentUser.friends = currentUser.friends.filter((friend: IUser) => {
      friend._id.toString() !== friendId;
    });

    if (
      currentUser.closeFriends.some(
        (friend) => friend._id.toString() === findFriend._id.toString()
      )
    ) {
      currentUser.closeFriends = currentUser.closeFriends.filter(
        (friend) => friend._id !== updatedFriend._id
      );
    } else {
      currentUser.closeFriends.push(updatedFriend);
    }

    await currentUser.save();

    return res.status(201).json({ _id: currentUser._id });
  } catch (err) {
    next(err);
  }
};