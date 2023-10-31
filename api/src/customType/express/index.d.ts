import { TUserInfo } from "../../config/jwt";
import { IFriendRequestTable } from "../../controllers/type/friends";

declare global {
    namespace Express {
        interface Request {
            user: TUserInfo
        }
    }
}