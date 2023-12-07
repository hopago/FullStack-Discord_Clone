import Post from "../models/Post.js";
import User from "../models/User.js";
import { HttpException } from "../middleware/error/utils.js";
import { Response, Request, NextFunction } from "express";
import Comment from "../models/Comment.js";

// export const getPostsBySortOptions = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const fetchType = req.query.sort;
//   const categories = req.query.categories;
//   const userLanguage = req.query.language;

//   if (fetchType === "undefined") return res.status(400).json("Fetch Type is required...");

//   const checkIsArray = (
//     array: (Document<unknown, {}, IPost> &
//       IPost & {
//         _id: Types.ObjectId;
//       })[]
//   ) => {
//     return Array.isArray(array) && !array.length
//   };

//   if (fetchType === "latest") {
//     try {
//       const posts = await Post.find().sort({ createdAt: -1 }).limit(10);
//       if (checkIsArray(posts))
//         throw new HttpException(400, "No post found...");

//       res.status(200).json(posts);
//     } catch (err) {
//       next(err);
//     }
//   } else if (fetchType === "trend") {
//     try {
//       const posts = await Post.find().sort({
//         views: -1,
//       });
//       if (checkIsArray(posts))
//         throw new HttpException(400, "No post found...");

//       res.status(200).json(posts);
//     } catch (err) {
//       next(err);
//     }
//   } else if (fetchType === "recommend") {
//     if (categories === "undefined" && userLanguage) {
//       try {
//         const posts = await Post.find({
//           category: userLanguage,
//         }).limit(20);

//         if (!posts || (Array.isArray(posts) && !posts.length))
//           throw new HttpException(400, "No post found...");

//         res.status(200).json(posts);
//       } catch (err) {
//         next(err);
//       }
//     } else if (userLanguage === "undefined" && categories) {
//       let categoryArr: string[] = [];

//       if (typeof categories === "string") {
//         const splitCategories = categories.split("#");
//         categoryArr.push(...splitCategories);
//       }
//       try {
//         const posts = await Post.find({
//           category: { $in: categoryArr },
//         }).limit(20);

//         if (!posts || (Array.isArray(posts) && !posts.length))
//           throw new HttpException(400, "No post found...");

//         res.status(200).json(posts);
//       } catch (err) {
//         next(err);
//       }
//     } else {
//       return res.sendStatus(400);
//     }
//   } else {
//     return res.sendStatus(400);
//   }
// };

const getPosts = async (filter: any, sort: any, limit: number) => {
  const posts = await Post.find(filter).sort(sort).limit(limit);
  if (!posts.length) throw new HttpException(400, "No post found...");
  return posts;
};

export const getPostsBySortOptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fetchType = req.query.sort;
  const categories = req.query.categories;
  const userLanguage = req.query.language;

  if (!fetchType) return res.sendStatus(400);

  try {
    let filter = {};
    let sort = {};
    let limit = 20;

    if (fetchType === "latest") {
      sort = { createdAt: -1 };
      limit = 10;
    } else if (fetchType === "trend") {
      sort = { views: -1 };
    } else if (fetchType === "recommend") {
      if (categories !== "undefined" && userLanguage) {
        filter = { category: userLanguage };
      } else if (userLanguage !== "undefined" && categories) {
        let categoryArr: string[] = [];

        if (typeof categories === "string") {
          const splitCategories = categories.split("#");
          categoryArr.push(...splitCategories);
        }

        filter = { category: { $in: categoryArr } };
      } else {
        return res.sendStatus(400);
      }
    } else {
      return res.sendStatus(400);
    }

    const posts = await getPosts(filter, sort, limit);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
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
      return res.sendStatus(401);

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
    if (!author) throw new HttpException(400, "Could not found this user...");

    const posts = await Post.find({
      author: {
        authorId,
      },
    })
    .limit(10)
    .sort('-createdAt');

    if (!posts || (Array.isArray(posts) && !posts.length))
      throw new HttpException(400, "No post found...");

    res.send(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getTrendPostsByAuthorId = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorId = req.params.authorId;
  if (!authorId || authorId === "undefined") return res.sendStatus(400);

  try {
    const posts = await Post.aggregate([
      { $match: { "author.authorId": authorId } },
      {
        $addFields: {
          totalReactions: {
            $add: [
              { $size: "$reactions.thumbsUp" },
              { $size: "$reactions.wow" },
              { $size: "$reactions.heart" },
              { $size: "$reactions.rocket" },
              { $size: "$reactions.coffee" },
              "$views",
            ],
          },
        },
      },
      { $sort: { totalReactions: -1 } },
      { $limit: 3 },
    ]);
    if (!posts.length) throw new HttpException(400, "No post found...");

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getSinglePostReactionsLength = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;
  if (!postId || postId === "undefined") return res.sendStatus(400);

  try {
    const post = await Post.aggregate([
      { $match: { _id: postId } },
      {
        $addFields: {
          $add: [
            { $size: "$reactions.thumbsUp" },
            { $size: "$reactions.wow" },
            { $size: "$reactions.heart" },
            { $size: "$reactions.rocket" },
            { $size: "$reactions.coffee" },
          ],
        },
      },
    ]);
    if (!post.length) return res.status(400).json("No post found...");

    return res.status(200).json(post[0].totalReactions);
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
    if (!post) throw new HttpException(400, "Could not found this post...");

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
    if (!post) throw new HttpException(400, "Could not found this post...");

    if (req.user.id === post.author.authorId.toString()) {
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
    if (!post) throw new HttpException(400, "Could not found post...");

    if (req.user.id === post.author.authorId.toString()) {
      await Comment.find({
        "comments.0.postId": post._id,
      }).deleteMany();
      
      await post.deleteOne();

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
      throw new HttpException(400, "Could not found post...");

    const reactionName: string = req.body.reactionName;
    const reactionsObject: {
      [key: string]: [string];
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
      if (findIndex === -1) return res.sendStatus(400);
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
