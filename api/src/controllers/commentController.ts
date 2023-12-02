import { Request, Response, NextFunction } from "express";
import Comment, { IComment } from "../models/Comment.js";
import User from "../models/User.js";
import { HttpException } from "../middleware/error/utils.js";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const author = await User.findById(req.user.id);
    if (author === null || !author) throw new HttpException(401, "Something went wrong in verifyToken...");

    const newComment = new Comment({
      comments: [
        {
          postId: req.body.postId,
          author: {
            authorId: author._id,
            userName: author.userName,
            avatar: author.avatar,
          },
          ...req.body,
        },
      ],
    });
    const savedComment = await newComment.save();

    res.status(200).json(savedComment);
  } catch (err) {
    next(err);
  }
}

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const fetchType = req.query.sort;
  const fetchCount = req.query.fetchCount;
  const postId = req.query.postId;
  const skipNumber = Number(fetchCount);
  try {
    if (fetchType === "latest") {
      const comments = await Comment.find({
        'comments.0.postId': postId
      })
        .sort({ createdAt: - 1 })
        .skip(skipNumber * 10)
        .limit(10)
        .exec();
      if (!comments || (Array.isArray(comments) && !comments.length)) return res.sendStatus(400);

      res.status(200).json(comments);
    } else if (fetchType === "related") {
      const comments = await Comment.find({
        "comments.0.postId": postId,
      })
        .sort({ "comments.0.comment_like_count": -1 })
        .limit(10)
        .exec();

      if (!comments || (Array.isArray(comments) && !comments.length)) return res.sendStatus(400);

      res.status(200).json(comments);
    }
  } catch (err) {
    next(err);
  }
};

export const getCommentsLength = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.query.postId;
  try {
    const comments: IComment[] | null = await Comment.find({
      "comments.0.postId": postId
    });
    if (!comments || (Array.isArray(comments) && !comments.length)) return res.sendStatus(400);

    const commentLength = {
      length: comments.length
    }

    res.status(200).json(commentLength);
  } catch (err) {
    next(err);
  }
};

export const getComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) res.status(400).json("No comment found yet...");

    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
}

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) res.status(400).json("No comment found yet...");

    if (comment?.comments[0].author.authorId.toString() !== req.user.id) return res.sendStatus(405);
    
    const updatedComment = await comment.updateOne({
      $set: {
        "comments.0.description": req.body.description
      }
    },
    { new: true }
    );

    res.status(201).json(updatedComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  if (commentId === 'undefined' || !commentId) return res.sendStatus(400);
  try {
    const comment = await Comment.findById(commentId);
    if (req.user.id !== comment?.comments[0].author.authorId.toString()) return res.sendStatus(405);
    await comment.deleteOne();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const replyComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  if (!commentId || commentId === "undefined") return res.sendStatus(400);
  try {
    const currentUser = await User.findOne({
      _id: req.user.id
    });
    if (!currentUser) res.status(400).json("Cannot found that user...");

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(400).json("Cannot found comment...");

    let commentReply: object[] = comment.comments[0].comment_reply;

    const commentReplyObj = {
      referenced_comment: commentId,
      user: {
        userId: currentUser?._id,
        userName: currentUser?.userName,
        avatar: currentUser?.avatar
      },
      description: req.body.description
    }

    commentReply = [...commentReply, commentReplyObj];

    const updatedComment = await comment.updateOne(
      {
        $set: {
          "comments.0.comment_reply": commentReply,
        },
      },
      { new: true }
    );
    if (!updatedComment) res.sendStatus(500);

    res.status(201).json(updatedComment);
  } catch (err) {
    next(err);
  }
};

export const updateReplyComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  if (!commentId || commentId === "undefined") return res.sendStatus(400);
  try {
    const ref_comment = await Comment.findById(commentId);
    if (!ref_comment) return res.status(400).json("Could not found referenced comment...");

    const findIndex = ref_comment.comments[0].comment_reply.findIndex(
      (replyObj) =>
        replyObj.description === req.body.originDescription
    );
    if (findIndex === - 1) return res.sendStatus(400);

    const isVerified = ref_comment.comments[0].comment_reply[findIndex].user.userId.toString() === req.user.id;
    if (!isVerified) return res.sendStatus(401);

    const description = req.body.description;
    if (!Boolean(description) || description === "undefined")
      return res.sendStatus(400);

    const currDate = new Date();
    const updatedAt = currDate.toISOString();

    const updatedComment = ref_comment.comments[0].comment_reply[findIndex];
    if (!updatedComment) return res.sendStatus(500);

    updatedComment.description = description;
    updatedComment.updatedAt = updatedAt;

    ref_comment.comments[0].comment_reply.splice(findIndex, 1, updatedComment);

    await ref_comment.save();

    res.status(201).json(ref_comment);
  } catch (err) {
    next(err);
  }
};

export const deleteReplyComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  if (!commentId || commentId === "undefined") return res.sendStatus(400);
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(400).json("Comment could not found...");

    const findIndex = comment.comments[0].comment_reply.findIndex(
      (reply) =>
        reply.description === req.body.description &&
        reply.user.userId.toString() === req.user.id
    );
    if (findIndex === - 1) return res.sendStatus(400);

    comment.comments[0].comment_reply.splice(findIndex, 1);

    await comment.save();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const likeComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findOne({
      _id: commentId
    });

    if (!comment) return res.sendStatus(400);

    if (!comment?.comments[0].comment_like_count.includes(req.user.id)) {
      const updatedComment = await comment?.updateOne(
        {
          $push: {
            "comments.0.comment_like_count": req.user.id,
          },
        },
        { new: true }
      );

      res.status(201).json(updatedComment);
    } else {
      const updatedComment = await comment.updateOne(
        {
          $pull: {
            "comments.0.comment_like_count": req.user.id,
          },
        },
        { new: true }
      );

      res.status(201).json(updatedComment);
    }
  } catch (err) {
    next(err);
  }
};
