var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/User.js";
import { createMemo } from "../services/createMemo.js";
import Memo from "../models/FriendMemo.js";
export const addMemo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    if (!friendId || friendId === "undefined")
        return res.status(400).json("Friend Id required...");
    try {
        const currentUser = yield User.findById(currentUserId);
        if (!currentUser)
            return res.status(404).json("Something went wrong in verifying...");
        const isFriendExisted = yield User.findById(friendId);
        if (!isFriendExisted)
            return res.status(404).json("Something went wrong in friendId...");
        const memo = yield createMemo(req, res, next);
        return res.status(200).json(memo);
    }
    catch (err) {
        next(err);
    }
});
export const getMemo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    if (!currentUserId || !friendId || friendId === "undefined")
        return res.sendStatus(400).json("Something went wrong in creds...");
    try {
        const memo = yield Memo.findOne({
            referenced_user: currentUserId,
            friendId,
        });
        if (!memo)
            return res.status(404).json("Memo not found...");
        return res.status(200).json(memo);
    }
    catch (err) {
        next(err);
    }
});
export const updateMemo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    if (!currentUserId || !friendId)
        return res.sendStatus(400).json("Something went wrong in creds...");
    try {
        const updatedMemo = yield Memo.findOneAndUpdate({
            referenced_user: currentUserId,
            friendId,
        }, {
            $set: {
                memo: req.body.memo,
            },
        }, {
            new: true,
        });
        if (!updateMemo)
            return res.status(500).json("Something went wrong in updating memo...");
        return res.status(201).json(updatedMemo);
    }
    catch (err) {
        next(err);
    }
});
export const deleteMemo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    if (!currentUserId || !friendId || friendId === "undefined")
        return res.sendStatus(400).json("Something went wrong in creds...");
    try {
        const memo = yield Memo.findOneAndDelete({
            referenced_user: currentUserId,
            friendId,
        });
        if (!memo)
            return res.status(404).json("Memo not found...");
        return res.status(204).json({ _id: memo._id });
    }
    catch (err) {
        next(err);
    }
});
