var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCloseFriendsArray } from "../services/closeFriends/getCloseFriend.js";
import { addCloseFriend as services_addCloseFriend } from "../services/closeFriends/addCloseFriend.js";
import { removeCloseFriend as services_removeCloseFriend } from '../services/closeFriends/removeCloseFriend.js';
export const getCloseFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const closeFriends = yield getCloseFriendsArray(req, res, next);
        return res.status(200).json(closeFriends);
    }
    catch (err) {
        next(err);
    }
});
export const addCloseFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCloseFriends = yield services_addCloseFriend(req, res, next);
        return updatedCloseFriends;
    }
    catch (err) {
        next(err);
    }
});
export const removeCloseFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCloseFriends = yield services_removeCloseFriend(req, res, next);
        return updatedCloseFriends;
    }
    catch (err) {
        next(err);
    }
});
