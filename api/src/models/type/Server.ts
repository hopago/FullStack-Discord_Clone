<<<<<<< HEAD
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
=======
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
>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
};