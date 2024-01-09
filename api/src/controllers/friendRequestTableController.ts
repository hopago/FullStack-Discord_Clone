import FriendAcceptReject from "../models/FriendRequestTable.js";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User.js";
import PrivateConversation from "../models/PrivateConversation.js";
import { getFriendRequestNotifications } from "../services/notifications/getNotifications.js";
import { createFriendRequestNotification } from "../services/notifications/createNotification.js";
import { deleteFriendRequestNotification } from "../services/notifications/deleteNotification.js";
import { seeFriendRequestNotification } from "../services/notifications/seeNotification.js";

{
  /* 12 05 22 40 */
}

export const getAllFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(403).json("Something went wrong in verifying...");

    const requestList = await FriendAcceptReject.findOne({
      referenced_user: user?._id,
    });
    if (!requestList) {
      return res.status(500).json("Something went wrong in referenced...");
    }

    return res.status(200).json(requestList);
  } catch (err) {
    next(err);
  }
};

export const getReceivedCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(403).json("Something went wrong in verifying...");

    const userId = user?._id.toString();

    const requestList = await FriendAcceptReject.findOne({
      referenced_user: userId,
    });
    if (!requestList) {
      return res.status(500).json("Something went wrong in referenced...");
    }

    const receivedCount = requestList?.members?.length;
    if (receivedCount === undefined) return res.sendStatus(500);

    return res.status(200).json({ count: receivedCount, _id: requestList._id });
  } catch (err) {
    next(err);
  }
};

export const sendFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const { userName, tag } = req.query;
  try {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser)
      return res.status(400).json("Something went wrong in verifying...");
    const receiver = await User.findOne({
      userName,
      tag,
    });
    if (!receiver) return res.status(400).json("Could not found receiver...");

    const receiverId = receiver._id.toString();

    const requestTable = await FriendAcceptReject.findOne({
      referenced_user: receiverId,
    });
    if (!requestTable)
      return res
        .status(500)
        .json(`"Something went wrong in table...", ${requestTable}`);

    if (
      !requestTable?.members.some(
        (member: IUser) => member._id?.toString() === (currentUserId as never)
      )
    ) {
      try {
        const { _id, description, language, userName, avatar, banner } =
          currentUser;
        const currentUserInfo = {
          _id,
          description,
          language,
          userName,
          avatar,
          banner,
        };

        await requestTable?.updateOne(
          {
            $push: {
              members: currentUserInfo,
            },
          },
          { new: true }
        );

        return res.status(201).json({
          _id: requestTable?._id,
          receiverId: receiver._id,
          senderId: req.user.id,
        });
      } catch (err) {
        next(err);
      }
    } else {
      return res.status(407).json("Friend request already sended...");
    }
  } catch (err) {
    next(err);
  }
};

export const handleRequestFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUserId = req.user.id;
  const senderId: string = req.params.senderId as string;
  const isAccepted: boolean = req.body.isAccepted;
  if (!senderId) return res.status(400).json("Sender Id required...");
  try {
    const sender = await User.findById(senderId);
    const currentUser = await User.findById(currentUserId);
    if (!sender || !currentUser)
      return res.status(400).json("Cannot find that users...");

    const requestTable = await FriendAcceptReject.findOne({
      referenced_user: currentUserId,
    });
    if (!requestTable)
      return res.status(400).json("Something went wrong in requestTable...");

    if (
      requestTable?.members.some(
        (member: IUser) => member._id?.toString() === (senderId as string)
      )
    ) {
      try {
        if (
          isAccepted &&
          !sender?.friends.some(
            (friend: IUser) =>
              friend._id?.toString() === (currentUserId as string)
          )
        ) {
          try {
            const { _id, description, language, userName, avatar, banner } =
              currentUser;
            const currentUserInfo = {
              _id,
              description,
              language,
              userName,
              avatar,
              banner,
            };

            const {
              _id: senderId,
              description: senderDesc,
              language: senderLang,
              userName: senderName,
              avatar: senderAvatar,
              banner: senderBanner,
            } = sender;

            const senderInfo = {
              senderId,
              senderDesc,
              senderLang,
              senderName,
              senderAvatar,
              senderBanner,
            };

            await sender?.updateOne({
              $push: { friends: currentUserInfo },
            });
            await currentUser?.updateOne({
              $push: { friends: senderInfo },
            });
            await requestTable.updateOne({
              $pull: {
                members: {
                  _id: sender._id,
                },
              },
            });

            const newConversation = new PrivateConversation({
              members: [senderInfo, currentUserInfo],
              senderId: sender?._id,
              receiverId: currentUser?._id,
              readBySender: false,
              readByReceiver: true,
            });
            await newConversation.save();

            return res
              .status(201)
              .json({ newConversation, currentUser, requestTable });
          } catch (err) {
            next(err);
          }
        } else {
          try {
            await requestTable.updateOne({
              $pull: {
                members: {
                  _id: sender._id,
                },
              },
            });

            return res.status(201).json("Friend request rejected...");
          } catch (err) {
            next(err);
          }
        }
      } catch (err) {
        next(err);
      }
    } else {
      return res.status(400).json("Friend request not found...");
    }
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notifications = await getFriendRequestNotifications(req, res, next);
    if (!notifications)
      return res
        .status(500)
        .json("Something went wrong in getNotifications...");

    return res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createFriendRequestNotification(req, res, next);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedList = await deleteFriendRequestNotification(req, res, next);

    return res.status(201).json(deletedList);
  } catch (err) {
    next(err);
  }
};

export const seeNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedNotification = await seeFriendRequestNotification(
      req,
      res,
      next
    );

    if (updatedNotification) {
      return res.status(201).json(updatedNotification);
    }
  } catch (err) {
    next(err);
  }
};
