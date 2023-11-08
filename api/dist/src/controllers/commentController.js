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
export const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sortOption = req.query.sort;
    const fetchCount = req.query.fetchCount;
    const postId = req.query.postId;
    const skipNumber = Number(fetchCount);
    try {
        if (sortOption === "latest") {
            const comments = yield Comment.find({
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
        }
        else {
        }
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
        const comment = Comment.findByIdAndUpdate(commentId, {
            $set: {
                "comments.$.comment_reply.$.description": req.body.description,
            },
        }, { new: true })
            .select("comments.$.comment_reply")
            .exec();
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
        const comment = yield Comment.findById(commentId);
        if (!(comment === null || comment === void 0 ? void 0 : comment.comments[0].comment_like_count.includes(req.user.id))) {
            yield (comment === null || comment === void 0 ? void 0 : comment.updateOne({
                $push: {
                    'comments.$.comment_like_count': req.user.id
                }
            }));
        }
        else {
            yield comment.updateOne({
                $pull: {
                    'comments.$.comment_like_count': req.user.id
                }
            });
        }
        if (!comment)
            res.sendStatus(500);
        res.status(201).json(comment);
    }
    catch (err) {
        next(err);
    }
});
