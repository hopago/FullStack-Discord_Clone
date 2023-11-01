var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Post from "../models/Post.js";
import User from "../models/User.js";
import { HttpException } from "../middleware/error/utils.js";
export const addPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const author = yield User.findById(req.user.id);
        if (author === null || !author)
            throw new HttpException(401, "Something went wrong in verifyToken...");
        const newPost = new Post(Object.assign({ author: {
                authorId: author._id,
                userName: author.userName,
                avatar: author.avatar,
            } }, req.body));
        const savedPost = yield newPost.save();
        res.status(200).json(savedPost);
    }
    catch (err) {
        next(err);
    }
});
export const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) {
        next(err);
    }
});
export const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post.findById(req.params.postId);
        if (!post)
            throw new HttpException(404, "Could not found this post...");
        if (req.user.id === post.author.authorId) {
            const updatedPost = yield Post.findByIdAndUpdate(req.params.postId, {
                $set: req.body,
            }, { new: true });
            res.status(201).json(updatedPost);
        }
        else {
            throw new HttpException(403, "Something went wrong in token...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post.findById(req.params.postId);
        if (!post)
            throw new HttpException(404, "Could not found post...");
        if (req.user.id === post.author.authorId) {
            yield Post.findByIdAndDelete(req.params.postId);
            res.sendStatus(204);
        }
        else {
            throw new HttpException(403, "Something went wrong in token...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post.findById(req.params.postId);
        if (post === null && !post)
            throw new HttpException(404, "Could not found post...");
        const reactionName = req.body.reactionName;
        const reactionsObject = post.reactions;
        const isExist = Object.keys(reactionsObject).includes(reactionName);
        if (!isExist) {
            throw new HttpException(400, "Bad request...");
        }
        else {
            post.reactions[reactionName]++;
            yield post.save();
        }
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
export const addViewOnPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Post.findByIdAndUpdate(req.params.postId, {
            $inc: {
                views: 1,
            },
        });
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
export const getLatestPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.find({}, { sort: "created_at" }).limit(10);
        if (Array.isArray(posts) && !posts.length)
            throw new HttpException(400, "No post found...");
        res.status(200).json(posts);
    }
    catch (err) {
        next(err);
    }
});
export const getTrendPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.find().sort({
            views: -1,
        });
        if (Array.isArray(posts) && !posts.length)
            throw new HttpException(400, "No post found...");
        res.status(200).json(posts);
    }
    catch (err) {
        next(err);
    }
});
export const findByPostsCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = req.query.categories;
    if (categories === undefined)
        throw new HttpException(400, "Bad request...");
    let categoryArr = [];
    if (typeof categories === "string") {
        const splitCategories = categories.split("#");
        return categoryArr.push(...splitCategories);
    }
    try {
        if (Array.isArray(categoryArr) && categoryArr.length) {
            const posts = yield Post.find({
                category: { $in: categoryArr },
            }).limit(20);
            res.status(200).json(posts);
        }
        else {
            throw new HttpException(400, "Bad Request...");
        }
    }
    catch (err) {
        next(err);
    }
});
