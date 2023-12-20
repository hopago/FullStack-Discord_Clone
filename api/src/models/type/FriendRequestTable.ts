import { IUser } from "../User";

export type TFriendRequestTable = {
  referenced_user: string;
  members: IUser[];
  notifications: {
    senderInfo: IUser[],
    type: string,
    isRead: boolean,
  }
};