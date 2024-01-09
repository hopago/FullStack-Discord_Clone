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
        const requestList = yield FriendAcceptReject.findOne({
            referenced_user: req.user.id
        });
        if (!requestList)
            return res.status(404).json("User not found...");
        let index = -1;
        const updatedNotification = requestList.notifications.find((notification, i) => {
            const isMatch = notification.senderInfo.userName === req.body.userName && notification.type === req.body.type;
            if (isMatch)
                index = i;
            return isMatch;
        });
        if (index === -1 || !updatedNotification)
            return res.status(404).json("Notification not found...");
        requestList.notifications.splice(index, 1, updatedNotification);
        yield requestList.save();
        return updatedNotification;
    }
    catch (err) {
        throw new HttpException(500, `FriendRequestNotifications Error: ${err}`);
    }
});
