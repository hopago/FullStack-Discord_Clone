import { TUser } from "./User";

export type TFriendRequestTable = {
    table: {
        referenced_user: string,
        members: [TUser],
    }
};