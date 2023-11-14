import Post from "../models/Post.js";
import User, { IUser } from "../models/User.js";
import { HttpException } from "../middleware/error/utils.js";
import { Response, Request, NextFunction } from "express";

export const getPostsBySortOptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fetchType = req.query.sort;
  const checkFetchType = Boolean(fetchType);

  if (checkFetchType) {
    if (fetchType === "latest") {
      try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(10);
        if (Array.isArray(posts) && !posts.length)
          throw new HttpException(400, "No post found...");

        res.status(200).json(posts);
      } catch (err) {
        next(err);
      }
    } else if (fetchType === "trend") {
      try {
        const posts = await Post.find().sort({
          views: -1,
        });
        if (Array.isArray(posts) && !posts.length)
          throw new HttpException(400, "No post found...");

        res.status(200).json(posts);
      } catch (err) {
        next(err);
      }
    } else if (fetchType === "recommend") {
      const categories = req.query.categories;
      const userLanguage = req.query.language;
      if (categories === 'undefined' && userLanguage) {
        try {
          const posts = await Post.find({
            category: userLanguage,
          }).limit(20);

          if (!posts || (Array.isArray(posts) && !posts.length))
            throw new HttpException(400, "No post found...");

          res.status(200).json(posts);
        } catch (err) {
          next(err);
        }
      } else if (userLanguage === 'undefined' && categories) {
        let categoryArr: string[] = [];

        if (typeof categories === "string") {
          const splitCategories = categories.split("#");
          return categoryArr.push(...splitCategories);
        }
        try {
          const posts = await Post.find({
            category: { $in: categoryArr },
          }).limit(20);

          if (!posts || (Array.isArray(posts) && !posts.length))
            throw new HttpException(400, "No post found...");

          res.status(200).json(posts);
        } catch (err) {
          next(err);
        }
      } else {
        throw new HttpException(400, "Bad request...");
      }
    } else {
      throw new HttpException(400, "Bad request...");
    }
  }
};

export const addPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await User.findById(req.user.id);
    if (author === null || !author)
      throw new HttpException(401, "Something went wrong in verifyToken...");

    const newPost = new Post({
      author: {
        authorId: author._id,
        userName: author.userName,
        avatar: author.avatar,
      },
      ...req.body,
    });
    const savedPost = await newPost.save();

    res.status(200).json(savedPost);
  } catch (err) {
    next(err);
  }
};

export const getPostsByAuthorId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorId: string = req.params.authorId;
  try {
    const author = await User.findById(authorId);
    if (!author) throw new HttpException(404, "Could not found this user...");

    const posts = await Post.find({
      author: {
        authorId,
      },
    }).limit(10);

    if (!posts || (Array.isArray(posts) && !posts.length))
      throw new HttpException(400, "No post found...");

    res.send(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) throw new HttpException(404, "Could not found this post...");

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;
  if (postId === "undefined" || !postId) return res.sendStatus(400);
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) throw new HttpException(404, "Could not found this post...");

    if (req.user.id === post.author.authorId) {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(201).json(updatedPost);
    } else {
      throw new HttpException(403, "Something went wrong in token...");
    }
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) throw new HttpException(404, "Could not found post...");

    if (req.user.id === post.author.authorId) {
      await Post.findByIdAndDelete(req.params.postId);

      res.sendStatus(204);
    } else {
      throw new HttpException(403, "Something went wrong in token...");
    }
  } catch (err) {
    next(err);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post === null && !post)
      throw new HttpException(404, "Could not found post...");

    const reactionName: string = req.body.reactionName;
    const reactionsObject: {
      [key: string]: [IUser["_id"]];
    } = post.reactions;

    const isExist = Object.keys(reactionsObject).includes(reactionName);
    if (!isExist) {
      throw new HttpException(400, "Bad request...");
    }

    if (!(reactionsObject[reactionName].includes(req.user.id))) {
      post.reactions[reactionName].push(req.user.id);
      await post.save();
      const updatedPost = post;

      res.status(201).json(updatedPost);
    } else {
      const findIndex = post.reactions[reactionName].findIndex(_id => _id === req.user.id);
      if (findIndex === -1) return res.sendStatus(404);
      post.reactions[reactionName].splice(findIndex, 1);
      await post.save();
      const updatedPost = post;

      res.status(201).json(updatedPost);
    }
  } catch (err) {
    next(err);
  }
};

export const addViewOnPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $inc: {
        views: 1,
      },
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
