import FriendAcceptReject from "../models/FriendRequestTable.js";
import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import PrivateConversation from "../models/PrivateConversation.js";
import { TUserWithId } from "../models/type/User.js";

export const getAllFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(403).json("Something went wrong in verifying...");

    const requestList = await FriendAcceptReject.find({
      referenced_user: user?._id,
    });
    if (!requestList) {
      return res.status(500).json("Something went wrong in referenced...");
    }

    res.status(200).json(requestList);
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

    const userId = user?._id.toHexString();

    const requestList = await FriendAcceptReject.findOne({
      referenced_user: userId,
    });
    if (!requestList) {
      return res.status(500).json("Something went wrong in referenced...");
    }

    const receivedCount = requestList?.members?.length;
    if (receivedCount === undefined) return res.sendStatus(500);

    res.status(200).json({ count: receivedCount, _id: req.user.id });
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

    const receiverId = receiver._id.toHexString();

    const requestTable = await FriendAcceptReject.findOne({
      referenced_user: receiverId,
    });
    if (!requestTable)
      return res
        .status(500)
        .json(`"Something went wrong in table...", ${requestTable}`);

    if (
      !requestTable?.members.some(
        (member: TUserWithId) => member._id?.toString() === (currentUserId as never)
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

        await requestTable?.updateOne({
          $push: {
            members: currentUserInfo
          },
        });
        return res.status(201).json({
          _id: requestTable?._id,
          receiverId: receiver._id,
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
        (member: TUserWithId) => member._id?.toString() === (senderId as string)
      )
    ) {
      try {
        if (
          isAccepted &&
          !sender?.friends.some(
            (friend: TUserWithId) => friend._id?.toString() === (currentUserId as string)
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
                  _id: sender._id
                }
              },
            });

            const newConversation = new PrivateConversation({
              members: [sender, currentUser],
              senderId: sender?._id,
              receiverId: currentUser?._id,
              readBySender: false,
              readByReceiver: true,
            });
            await newConversation.save();

            res
              .status(201)
              .json({ newConversation, currentUser, requestTable });
          } catch (err) {
            next(err);
          }
        } else {
          try {
            await requestTable.updateOne({
              $pull: {
                members: sender,
              },
            });
            res.status(201).json("Friend request rejected...");
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
