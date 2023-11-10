var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { HttpException } from "../middleware/error/utils.js";
export const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = yield User.findById(req.user.id);
        if (author === null || !author)
            throw new HttpException(401, "Something went wrong in verifyToken...");
        const newComment = new Comment({
            comments: [
                Object.assign({ postId: req.body.postId, author: {
                        authorId: author._id,
                        userName: author.userName,
                        avatar: author.avatar,
                    } }, req.body),
            ],
        });
        const savedComment = yield newComment.save();
        res.status(200).json(savedComment);
    }
    catch (err) {
        next(err);
    }
});
export const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fetchType = req.query.sort;
    const fetchCount = req.query.fetchCount;
    const postId = req.query.postId;
    const skipNumber = Number(fetchCount);
    try {
        if (fetchType === "latest") {
            const comments = yield Comment.find({
                'comments.0.postId': postId
            })
                .sort({ createdAt: -1 })
                .skip(skipNumber * 10)
                .limit(10)
                .exec();
            if (!comments || (Array.isArray(comments) && !comments.length))
                return res.sendStatus(400);
            res.status(200).json(comments);
        }
        else if (fetchType === "related") {
            const comments = yield Comment.find({
                "comments.0.postId": postId,
            })
                .sort({ "comments.0.comment_like_count": -1 })
                .limit(10)
                .exec();
            if (!comments || (Array.isArray(comments) && !comments.length))
                return res.sendStatus(400);
            res.status(200).json(comments);
        }
    }
    catch (err) {
        next(err);
    }
});
export const getCommentsLength = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.query.postId;
    try {
        const comments = yield Comment.find({
            "comments.0.postId": postId
        });
        if (!comments || (Array.isArray(comments) && !comments.length))
            res.sendStatus(400);
        const commentLength = {
            length: comments.length
        };
        res.status(200).json(commentLength);
    }
    catch (err) {
        next(err);
    }
});
export const getComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    try {
        const comment = yield Comment.findById(commentId);
        if (!comment)
            res.sendStatus(404);
        res.status(200).json(comment);
    }
    catch (err) {
        next(err);
    }
});
export const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    try {
        const comment = yield Comment.findById(commentId);
        if (!comment)
            res.sendStatus(404);
        if ((comment === null || comment === void 0 ? void 0 : comment.comments[0].author.authorId) !== req.user.id)
            return res.sendStatus(405);
        const updatedComment = yield comment.updateOne(Object.assign({}, req.body), { new: true });
        res.status(201).json(updatedComment);
    }
    catch (err) {
        next(err);
    }
});
export const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    if (commentId === 'undefined' || !commentId)
        return res.sendStatus(400);
    try {
        const comment = yield Comment.findById(commentId);
        if (req.user.id !== (comment === null || comment === void 0 ? void 0 : comment.comments[0].author.authorId))
            return res.sendStatus(405);
        yield comment.deleteOne();
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
export const replyComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    try {
        const currentUser = yield User.findOne({
            _id: req.user.id
        });
        if (!currentUser)
            res.sendStatus(404);
        const commentReplyObj = {
            user: {
                userId: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id,
                userName: currentUser === null || currentUser === void 0 ? void 0 : currentUser.userName,
                avatar: currentUser === null || currentUser === void 0 ? void 0 : currentUser.avatar
            },
            description: req.body.description
        };
        const comment = Comment.findByIdAndUpdate(commentId, {
            $set: {
                "comments.0.comment_reply": Object.assign({}, commentReplyObj),
            },
        }, { new: true }).exec();
        if (!comment)
            res.sendStatus(500);
        res.status(201).json(comment);
    }
    catch (err) {
        next(err);
    }
});
export const likeComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    try {
        const comment = yield Comment.findOne({
            _id: commentId
        });
        if (!comment)
            return res.sendStatus(400);
        if (!(comment === null || comment === void 0 ? void 0 : comment.comments[0].comment_like_count.includes(req.user.id))) {
            yield (comment === null || comment === void 0 ? void 0 : comment.updateOne({
                $push: {
                    "comments.0.comment_like_count": req.user.id,
                },
            }, { new: true }));
            res.status(201).json(comment);
        }
        else {
            yield comment.updateOne({
                $pull: {
                    "comments.0.comment_like_count": req.user.id,
                },
            }, { new: true });
            res.status(201).json(comment);
        }
    }
    catch (err) {
        next(err);
    }
});
