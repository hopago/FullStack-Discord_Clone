import { HttpException } from "../middleware/error/utils.js";
import User from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import { IFriends } from "./type/friends";

export const getSingleUser = async (req: Request, res: Response, next: NextFunction ) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('-password').lean();
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const updateUser =  async(req: Request, res: Response, next: NextFunction ) => {
    const userId = req.user.id;
    try {
        const { userName, description, language, avatar, password } = req.body;
        if (!userName || !description || !language) throw new HttpException(400, "All fields except avatar&password are required...");

        const user = await User.findById(userId).exec();
        if (!user) throw new HttpException(404, "User has not founded...");

        user.userName = userName;
        user.description = description;
        user.language = language;

        if (avatar) {
            user.avatar = avatar;
        }
        if (password) {
            user.password = bcrypt.hashSync(password, 10);
        }

        const updatedUser = await user.save();

        res.status(201).json(`${updatedUser.userName} has been updated...`);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction ) => {
    const userId = req.user.id;
    try {
        if (!userId) throw new HttpException(400, "User Id required...");

        const user = await User.findById(userId).exec();
        if (!user) throw new HttpException(404, "User not found...");

        const result = await user.deleteOne();

        res
          .status(200)
          .json(
            `UserName: ${result.userName} witt Id ${result._id} deleted...`
          );
    } catch (err) {
        next(err);
    }
};

export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    try {
        if (!userId) throw new HttpException(400, "User Id required...");

        const user = await User.findById(userId).exec();
        if (!user) throw new HttpException(404, "User not found...");

        const getAllPromise = <T>(promises: Promise<T>[]) => Promise.all(promises);
        const getAllFriends = user?.friends.map((friendId: string) =>
          User.findById(friendId)
        );
        const friends = await getAllPromise(getAllFriends);

        let friendList: object[] = [];
        friends.map((friend) => {
            const { _id, userName, avatar, description, language } = friend as IFriends;
            friendList.push({ _id, userName, avatar, description, language});
        });

        res.status(200).json(friendList);
    } catch (err) {
        next(err);
    }
};

export const getSingleFriend = async (req: Request, res: Response, next:NextFunction) => {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    try {
        const user = await User.findById(currentUserId);
        if (!user) throw new HttpException(404, "User not found...");

        const foundFriend: object[] = user.friends.filter((friend: IFriends) => {
            return friend._id === friendId;
        });

        res.status(200).json(foundFriend);
    } catch (err) {
        next(err);
    }
};

export const removeFriend = async (req: Request, res: Response, next:NextFunction) => {
    const currentUserId = req.user.id;
    const friendId = req.params?.friendId;
    try {
        const currentUser = await User.findById(currentUserId);
        const friend = await User.findById(friendId);

        if (!currentUser?.friends.includes(friend as never)) {
          await currentUser?.updateOne({
            $pull: {
              friends: friend,
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