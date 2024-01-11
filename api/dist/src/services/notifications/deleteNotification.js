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
import { Error } from "mongoose";
export const deleteFriendRequestNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestList = yield FriendAcceptReject.findOne({
            referenced_user: req.user.id
        });
        const index = requestList === null || requestList === void 0 ? void 0 : requestList.notifications.findIndex(notification => {
            return (notification.senderInfo.userName === req.body.userName &&
                notification.type === req.body.type);
        });
        if (index === -1)
            throw new HttpException(404, "Notification not found...");
        if (index === 0 || index) {
            requestList === null || requestList === void 0 ? void 0 : requestList.notifications.splice(index, 1);
        }
        yield (requestList === null || requestList === void 0 ? void 0 : requestList.save());
        return {
            status: 204
        };
    }
    catch (err) {
        if (err instanceof Error) {
            throw new HttpException(500, err.message);
        }
        else {
            throw new HttpException(500, `${err}`);
        }
    }
});
