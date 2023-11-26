import { TUserWithId } from "./User";

export type TFriendRequestTable = {
  referenced_user: string;
  members: [TUserWithId];
};