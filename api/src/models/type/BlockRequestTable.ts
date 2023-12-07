import { IUser } from "../User";

export type TBlockRequestTable = {
  referenced_user: string;
  members: IUser[];
};
