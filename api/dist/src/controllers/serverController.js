var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpException } from '../middleware/error/utils.js';
import User from '../models/User.js';
import Server from '../models/Server.js';
export const getAllServers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.query.category;
    if (!category) {
        try {
            const servers = yield Server.find().limit(20);
            if (!(servers === null || servers === void 0 ? void 0 : servers.length)) {
                throw new HttpException(400, "No server yet...");
            }
            res.status(200).json(servers);
        }
        catch (err) {
            next(err);
        }
    }
    else {
        try {
            const servers = yield Server.find({
                embeds: {
                    // make sure category string to lowercase
                    server_category: category,
                },
            })
                .limit(20);
            if (!(servers === null || servers === void 0 ? void 0 : servers.length)) {
                throw new HttpException(400, "No server yet...");
            }
            res.status(200).json(servers);
        }
        catch (err) {
            next(err);
        }
    }
});
export const getAllUserServers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        if (!userId) {
            const user = yield User.findById(req.user.id);
            if (!user)
                return res.status(404).json("User not found...");
            const servers = yield Server.find({
                members: {
                    $elemMatch: {
                        _id: { $eq: user._id }
                    }
                }
            });
            if (Array.isArray(servers) && !servers.length) {
                throw new HttpException(400, "No server joined yet...");
            }
            res.status(200).json(servers);
        }
        else {
            const user = yield User.findById(userId);
            if (!user)
                return res.status(404).json("User not found...");
            const servers = yield Server.find({
                members: {
                    $elemMatch: {
                        _id: { $eq: userId }
                    }
                }
            });
            if (Array.isArray(servers) && !servers.length) {
                throw new HttpException(400, "No server joined yet...");
            }
            res.status(200).json(servers);
        }
    }
    catch (err) {
        next(err);
    }
});
export const createServer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User.findById(req.user.id);
        if (user === null || !user)
            return res.status(404).json("User not found...");
        const { _id, description, language, userName, avatar, banner } = user;
        const userInfo = {
            _id,
            description,
            language,
            userName,
            avatar,
            banner
        };
        const newServer = new Server(Object.assign({ members: [userInfo], author: {
                authorId: req.user.id,
                userName: user === null || user === void 0 ? void 0 : user.userName,
                avatar: (_a = user === null || user === void 0 ? void 0 : user.avatar) !== null && _a !== void 0 ? _a : null
            } }, req.body));
        yield newServer.save();
        res.status(201).json(createServer);
    }
    catch (err) {
        next(err);
    }
});
export const deleteUserServer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const serverId = req.query.serverId;
    try {
        const user = yield User.findById(req.user.id);
        yield Server.findOneAndUpdate({
            _id: serverId,
        }, {
            $pull: {
                members: user === null || user === void 0 ? void 0 : user._id,
            },
        });
        res.sendStatus(204);
    }
    catch (err) {
        next(err);
    }
});
export const getSingleServer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = yield Server.findById(req.params.serverId);
        res.status(200).json(server);
    }
    catch (err) {
        next(err);
    }
});
export const updateServer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = yield Server.findById(req.params.serverId);
        if ((server === null || server === void 0 ? void 0 : server.author.authorId) === undefined)
            return res.status(500).json("Something went wrong in authorId...");
        const serverAuthorId = server === null || server === void 0 ? void 0 : server.author.authorId;
        if (serverAuthorId === req.user.id) {
            const updatedServer = yield (server === null || server === void 0 ? void 0 : server.updateOne({
                $set: req.body,
            }, { new: true }));
            res.status(200).json(updatedServer);
        }
        else {
            throw new HttpException(403, "Not allowed way...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const deleteServer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = yield Server.findById(req.params.serverId);
        const serverAuthorId = server === null || server === void 0 ? void 0 : server.author.authorId;
        if (serverAuthorId === req.user.id) {
            yield (server === null || server === void 0 ? void 0 : server.deleteOne());
            res.status(204);
        }
        else {
            throw new HttpException(403, "Not allowed way...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const getMembers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = yield Server.findById(req.params.serverId);
        if (server) {
            const members = server.members;
            if (Array.isArray(members) && members.length) {
                res.status(200).json(members);
            }
            else {
                return res.status(400).json("No server yet...");
            }
        }
        else {
            return res.status(404).json("Server not found...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const updateMembers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const joinedUserId = req.query.joinedUserId;
    const removedUserId = req.query.removedUserId;
    if (joinedUserId === "undefined" && removedUserId === "undefined")
        return res.sendStatus(400);
    if (!joinedUserId) {
        try {
            const server = yield Server.findByIdAndUpdate(req.params.serverId, {
                $pull: {
                    members: {
                        _id: removedUserId
                    }
                }
            }, { new: true });
            if (!server)
                return res.status(404).json("Server not found...");
            res.status(201).json(server);
        }
        catch (err) {
            next(err);
        }
    }
    else {
        try {
            const server = yield Server.findByIdAndUpdate(req.params.serverId, {
                $push: {
                    members: {
                        _id: joinedUserId
                    }
                }
            }, { new: true });
            if (!server)
                return res.status(404).json("Server not found...");
            res.status(201).json(server);
        }
        catch (err) {
            next(err);
        }
    }
});
export const likeServer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const server = yield Server.findById(req.params.serverId);
        const isLiked = server === null || server === void 0 ? void 0 : server.likes.includes(userId);
        if (isLiked) {
            yield Server.findByIdAndUpdate(req.params.serverId, {
                $pull: {
                    likes: userId
                }
            });
            res.sendStatus(201);
        }
        else {
            yield Server.findByIdAndUpdate(req.params.serverId, {
                $push: {
                    likes: userId
                }
            });
            res.sendStatus(201);
        }
    }
    catch (err) {
        next(err);
    }
});
export const searchServer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.searchTerm;
    try {
        const servers = yield Server.find({
            title: {
                $regex: query,
                $options: "i"
            }
        })
            .limit(20);
        if (Array.isArray(servers) && !servers.length)
            throw new HttpException(400, "Server not founded...");
        res.status(200).json(servers);
    }
    catch (err) {
        next(err);
    }
});
