var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CloseFriend from "../../models/CloseFriend";
import { HttpException } from "../../middleware/error/utils";
export const removeCloseFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    const friendId = req.params.friendId;
    if (!friendId)
        throw new HttpException(400, "Friend Id required...");
    try {
        const docs = yield CloseFriend.findOne({
            referencedUser: currentUserId,
        });
        if (!docs)
            throw new HttpException(404, "CloseFriend docs not found...");
        const { closeFriends } = docs;
        const index = closeFriends.findIndex((friend) => friend._id === friendId);
        if (index === -1)
            throw new HttpException(404, "CloseFriend not found...");
        closeFriends.splice(index, 1);
        yield docs.save();
        return closeFriends;
    }
    catch (err) {
        next(err);
    }
});
