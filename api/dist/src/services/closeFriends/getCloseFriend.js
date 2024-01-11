var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CloseFriend from "../../models/CloseFriend.js";
import { HttpException } from "../../middleware/error/utils.js";
export const getCloseFriendsArray = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    try {
        const docs = yield CloseFriend.findOne({
            referencedUser: currentUserId,
        });
        if (!docs)
            throw new HttpException(404, "CloseFriend docs not found...");
        const { closeFriends } = docs;
        if (closeFriends.length) {
            return closeFriends;
        }
    }
    catch (err) {
        next(err);
    }
});
