import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import User, { IUser } from "../models/User.js";
import Server from "../models/Server.js";

export const getAllServers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = req.query.category;
  if (!category) {
    try {
      const servers = await Server.find().limit(20);

      if (!servers?.length) {
        throw new HttpException(400, "No server yet...");
      }

      res.status(200).json(servers);
    } catch (err) {
      next(err);
    }
  } else {
    try {
      const servers = await Server.find({
        embeds: {
          // make sure category string to lowercase
          server_category: category,
        },
      }).limit(20);

      if (!servers?.length) {
        return res.status(400).json("No server yet...");
      }

      res.status(200).json(servers);
    } catch (err) {
      next(err);
    }
  }
};

export const getAllUserServers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { userId } = req.query;
  if (!userId || userId === "undefined") {
    userId = req.user.id;
  }

  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) return res.status(404).json("User not found...");

    const servers = await Server.find({
      "members._id": userId,
    });
    if (Array.isArray(servers) && !servers.length) {
      throw new HttpException(400, "No server joined yet...");
    }

    return res.status(200).json(servers);
  } catch (err) {
    next(err);
  }
};

export const createServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: IUser | null = await User.findById(req.user.id);
    if (user === null || !user)
      return res.status(404).json("User not found...");

    const { _id, description, language, userName, avatar, banner } = user;
    const userInfo = {
      _id,
      description,
      language,
      userName,
      avatar,
      banner,
    };

    const newServer = new Server({
      members: [userInfo],
      author: {
        authorId: req.user.id,
        userName: user?.userName,
        avatar: user?.avatar ?? null,
      },
      ...req.body,
    });
    await newServer.save();

    res.status(201).json(createServer);
  } catch (err) {
    next(err);
  }
};

export const deleteUserServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serverId = req.query.serverId;
  try {
    const user: IUser | null = await User.findById(req.user.id);

    await Server.findOneAndUpdate(
      {
        _id: serverId,
      },
      {
        $pull: {
          members: user?._id,
        },
      }
    );

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const getSingleServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const server = await Server.findById(req.params.serverId);

    res.status(200).json(server);
  } catch (err) {
    next(err);
  }
};

export const updateServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const server = await Server.findById(req.params.serverId);
    if (server?.author.authorId === undefined)
      return res.status(500).json("Something went wrong in authorId...");
    const serverAuthorId: string = server?.author.authorId;

    if (serverAuthorId === req.user.id) {
      const updatedServer = await server?.updateOne(
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedServer);
    } else {
      throw new HttpException(403, "Not allowed way...");
    }
  } catch (err) {
    next(err);
  }
};

export const deleteServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const server = await Server.findById(req.params.serverId);
    const serverAuthorId = server?.author.authorId;

    if (serverAuthorId === req.user.id) {
      await server?.deleteOne();

      res.status(204);
    } else {
      throw new HttpException(403, "Not allowed way...");
    }
  } catch (err) {
    next(err);
  }
};

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const server = await Server.findById(req.params.serverId);

    if (server) {
      const members = server.members;

      if (Array.isArray(members) && members.length) {
        res.status(200).json(members);
      } else {
        return res.status(400).json("No server yet...");
      }
    } else {
      return res.status(404).json("Server not found...");
    }
  } catch (err) {
    next(err);
  }
};

export const updateMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const joinedUserId = req.query.joinedUserId;
  const removedUserId = req.query.removedUserId;

  if (joinedUserId === "undefined" && removedUserId === "undefined")
    return res.sendStatus(400);

  if (!joinedUserId) {
    try {
      const server = await Server.findByIdAndUpdate(
        req.params.serverId,
        {
          $pull: {
            members: {
              _id: removedUserId,
            },
          },
        },
        { new: true }
      );
      if (!server) return res.status(404).json("Server not found...");

      res.status(201).json(server);
    } catch (err) {
      next(err);
    }
  } else {
    try {
      const server = await Server.findByIdAndUpdate(
        req.params.serverId,
        {
          $push: {
            members: {
              _id: joinedUserId,
            },
          },
        },
        { new: true }
      );
      if (!server) return res.status(404).json("Server not found...");

      res.status(201).json(server);
    } catch (err) {
      next(err);
    }
  }
};

export const likeServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  try {
    const server = await Server.findById(req.params.serverId);
    const isLiked = server?.likes.includes(userId);

    if (isLiked) {
      await Server.findByIdAndUpdate(req.params.serverId, {
        $pull: {
          likes: userId,
        },
      });

      res.sendStatus(201);
    } else {
      await Server.findByIdAndUpdate(req.params.serverId, {
        $push: {
          likes: userId,
        },
      });

      res.sendStatus(201);
    }
  } catch (err) {
    next(err);
  }
};

export const searchServer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query.searchTerm;
  try {
    const servers = await Server.find({
      title: {
        $regex: query,
        $options: "i",
      },
    }).limit(20);

    if (Array.isArray(servers) && !servers.length)
      throw new HttpException(400, "Server not founded...");

    res.status(200).json(servers);
  } catch (err) {
    next(err);
  }
};
