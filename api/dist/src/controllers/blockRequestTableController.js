var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpException } from "../middleware/error/utils.js";
import BlackList from "../models/BlockRequestTable.js";
import User from "../models/User.js";
export const getAllBlackList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id);
        const blackList = yield BlackList.findOne({
            referenced_user: user === null || user === void 0 ? void 0 : user._id
        });
        const blackListArr = blackList === null || blackList === void 0 ? void 0 : blackList.table.members;
        if (Array.isArray(blackListArr) && !(blackListArr === null || blackListArr === void 0 ? void 0 : blackListArr.length)) {
            throw new HttpException(400, "No list founded...");
        }
        res.status(200).json(blackListArr);
    }
    catch (err) {
        next(err);
    }
});
export const addBlockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const blockUserId = req.params.blockUserId;
    try {
        const blockUser = yield User.findById(blockUserId);
        const blockRequestTable = yield BlackList.findOne({
            referenced_user: currentUserId
        });
        if (!(blockRequestTable === null || blockRequestTable === void 0 ? void 0 : blockRequestTable.table.members.includes(blockUser))) {
            yield (blockRequestTable === null || blockRequestTable === void 0 ? void 0 : blockRequestTable.updateOne({
                $push: {
                    table: {
                        members: blockUser,
                    },
                },
            }));
            res.sendStatus(201);
        }
        else {
            throw new HttpException(500, "Something went wrong...");
        }
    }
    catch (err) {
        next(err);
    }
});
export const deleteBlockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const blockUserId = req.params.blockUserId;
    try {
        const blockUser = yield User.findById(blockUserId);
        const blockRequestTable = yield BlackList.findOne({
            referenced_user: currentUserId,
        });
        if (blockRequestTable === null || blockRequestTable === void 0 ? void 0 : blockRequestTable.table.members.includes(blockUser)) {
            yield (blockRequestTable === null || blockRequestTable === void 0 ? void 0 : blockRequestTable.updateOne({
                $pull: {
                    table: {
                        members: blockUser,
                    },
                },
            }));
            res.sendStatus(201);
        }
        else {
            res.status(500).json("Something went wrong...");
        }
    }
    catch (err) {
        next(err);
    }
});
