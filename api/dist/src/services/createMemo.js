var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Memo from "../models/FriendMemo.js";
import { HttpException } from "../middleware/error/utils.js";
export const createMemo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newMemo = new Memo({
        referenced_user: req.user.id,
        friendId: req.params.friendId,
        memo: req.body.memo
    });
    try {
        const memo = yield newMemo.save();
        return memo.toObject();
    }
    catch (err) {
        console.log(err);
        throw new HttpException(500, "Something went wrong in createMemo Func...");
    }
});
