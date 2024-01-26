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
export const addCloseFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendInfo = req.body;
    try {
        const docs = yield CloseFriend.findOne({
            referencedUser: currentUserId,
        });
        if (!docs) {
            try {
                const newDocs = new CloseFriend({
                    referencedUser: currentUserId,
                    closeFriends: [friendInfo],
                });
                yield newDocs.save();
                const { closeFriends } = newDocs;
                return closeFriends;
            }
            catch (err) {
                next(err);
            }
        }
        else {
            const isFriendAlreadyAdded = docs.closeFriends.some((friend) => friend._id === friendInfo._id);
            if (isFriendAlreadyAdded) {
                throw new HttpException(409, "Friend already existed...");
            }
            else {
                docs.closeFriends.push(friendInfo);
                yield docs.save();
                const { closeFriends } = docs;
                return closeFriends;
            }
        }
    }
    catch (err) {
        next(err);
    }
});
