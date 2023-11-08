import { Request, Response, NextFunction } from "express";
import Comment from "../models/Comment.js";

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sortOption = req.query.sort;
  const fetchCount = req.query.fetchCount;
  const postId = req.query.postId;
  const skipNumber = Number(fetchCount);
  try {
    if (sortOption === "latest") {
      const comments = await Comment.find({
        comments: {
          postId,
        },
      })
        .skip(skipNumber || 0)
        .limit(10)
        .exec();
      if (!comments || (Array.isArray(comments) && !comments.length))
        res.status(400).json("No comment created yet...");

      res.status(200).json(comments);
    } else {
    }
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) res.sendStatus(404);

    if (comment?.comments[0].author.authorId !== req.user.id) return res.sendStatus(405);
    
    const updatedComment = await comment.updateOne({
      ...req.body
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
  try {
    const comment = await Comment.findById(commentId);
    if (req.user.id !== comment?.comments[0].author.authorId) return res.sendStatus(405);
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
  try {
    const comment = Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          "comments.$.comment_reply.$.description": req.body.description,
        },
      },
      { new: true }
    )
      .select("comments.$.comment_reply")
      .exec();
    if (!comment) res.sendStatus(500);

    res.status(201).json(comment);
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
    const comment = await Comment.findById(commentId);

    if (!comment?.comments[0].comment_like_count.includes(req.user.id)) {
      await comment?.updateOne({
        $push: {
          'comments.$.comment_like_count': req.user.id
        }
      });
    } else {
      await comment.updateOne({
        $pull: {
          'comments.$.comment_like_count': req.user.id
        }
      });
    }
    if (!comment) res.sendStatus(500);

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};
