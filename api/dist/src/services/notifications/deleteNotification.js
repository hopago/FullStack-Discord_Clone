var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FriendAcceptReject from "../../models/FriendRequestTable.js";
export const deleteFriendRequestNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestList = yield FriendAcceptReject.findOne({
            referenced_user: req.user.id
        });
        const index = requestList === null || requestList === void 0 ? void 0 : requestList.notifications.findIndex(notification => {
            return (notification.senderInfo.userName === req.body.userName &&
                notification.type === req.body.type);
        });
        if (!index)
            return res.status(404).json("Notification not found...");
        requestList === null || requestList === void 0 ? void 0 : requestList.notifications.splice(index, 1);
        yield (requestList === null || requestList === void 0 ? void 0 : requestList.save());
        return {
            status: 204
        };
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
