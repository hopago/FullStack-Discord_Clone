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
export const getFriendRequestNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestList = yield FriendAcceptReject.findOne({ referenced_user: req.user.id });
        if (!requestList) {
            throw new HttpException(404, "Request Docs not found...");
        }
        const notificationArr = requestList.notifications;
        let notifications;
        if (req.query.fetchType === "notSeen") {
            notifications = notificationArr.filter((notification) => notification.isRead !== true);
        }
        else {
            notifications = notificationArr;
        }
        return notifications;
    }
    catch (err) {
        throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
    }
});
