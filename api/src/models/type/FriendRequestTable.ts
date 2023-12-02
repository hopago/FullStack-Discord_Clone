import { IUser } from "../User";

export type TFriendRequestTable = {
  referenced_user: string;
  members: IUser[];
};