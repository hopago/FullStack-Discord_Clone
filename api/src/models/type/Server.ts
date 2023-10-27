import { IUser } from "../User";

export type TServer = {
  members: [string: IUser["_id"]],
  custom_category: {
    parentCategory: string;
    childCategory: [string];
  },
  author: {
    authorId: IUser["_id"];
    userName: IUser["userName"];
    avatar: IUser["avatar"];
  },
  embeds: {
    server_category: string;
    title: string;
    description: string;
    thumbnail: string;
  },
  likes: [string: IUser["_id"]],
  isVerified: boolean
};