var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BlackList from "../models/BlockRequestTable.js";
import User from "../models/User.js";
{ /* 12 05 22 40 */ }
export const getAllBlackList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id);
        if (!user)
            return res.status(404).json("Something went wrong in verifying...");
        const blackList = yield BlackList.findOne({
            referenced_user: user === null || user === void 0 ? void 0 : user._id
        });
        if (!blackList)
            return res.status(404).json("Request docs not found...");
        const blackListArr = blackList.members;
        if (!blackListArr.length)
            return res.sendStatus(400);
        return res.status(200).json(blackListArr);
    }
    catch (err) {
        next(err);
    }
});
export const addBlockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const blockUserId = req.params.blockUserId;
    if (!currentUserId || !blockUserId)
        return res.status(400).json("Something went wrong in credentials...");
    try {
        const blockUser = yield User.findById(blockUserId);
        if (!blockUser)
            return res.status(404).json("User not found...");
        const { _id, avatar, userName, } = blockUser;
        const blockUserInfo = {
            _id,
            avatar,
            userName
        };
        const blackList = yield BlackList.findOne({
            referenced_user: currentUserId
        });
        if (!blackList)
            return res.status(404).json("Request docs not found...");
        if (!blackList.members.some((member) => member._id.toString() === blockUserId)) {
            yield (blackList === null || blackList === void 0 ? void 0 : blackList.updateOne({
                $push: {
                    members: blockUserInfo
                },
            }));
            return res
                .status(201)
                .json(Object.assign({ docsId: blackList._id }, blockUserInfo));
        }
        else {
            return res.status(500).json("Something went wrong in block user...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const deleteBlockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const blockUserId = req.params.blockUserId;
    if (!currentUserId || !blockUserId)
        return res.status(400).json("Something went wrong in credentials...");
    try {
        const blockUser = yield User.findById(blockUserId);
        if (!blockUser)
            return res.status(404).json("User not found...");
        const blackList = yield BlackList.findOne({
            referenced_user: currentUserId,
        });
        if (!blackList)
            return res.status(404).json("Request dos not found...");
        if (blackList.members.some((member) => member._id.toString() === blockUserId)) {
            try {
                yield (blackList === null || blackList === void 0 ? void 0 : blackList.updateOne({
                    $pull: {
                        members: {
                            _id: blockUserId,
                        },
                    },
                }));
                return res.status(201).json({ docsId: blackList._id });
            }
            catch (err) {
                next(err);
            }
        }
        else {
            res.status(500).json("Something went wrong...");
        }
    }
    catch (err) {
        next(err);
    }
});
