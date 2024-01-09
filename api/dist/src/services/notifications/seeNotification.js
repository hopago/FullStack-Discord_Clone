var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpException } from "../../middleware/error/utils.js";
import FriendAcceptReject from "../../models/FriendRequestTable.js";
export const seeFriendRequestNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestList = yield FriendAcceptReject.findOneAndUpdate({
            referenced_user: req.user.id,
            "notifications.senderInfo.userName": req.body.userName,
        }, {
            $set: {
                "notifications.$[elem].isRead": true,
            },
        }, {
            arrayFilters: [
                {
                    "elem.type": {
                        $in: ["friendRequest_send", "friendRequest_accept"],
                    },
                },
            ],
            new: true,
        });
        return requestList;
    }
    catch (err) {
        throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
    }
});
