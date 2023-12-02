import { ObjectId } from "mongoose";
import { IUser } from "../User";

export type TServer = {
  _id: ObjectId,
  members: IUser[],
  custom_category: {
    parentCategory: string;
    childCategory: string[];
  },
  author: {
    authorId: string;
    userName: IUser["userName"];
    avatar: IUser["avatar"];
  },
  embeds: {
    server_category: string;
    title: string;
    description: string;
    thumbnail: string;
  },
  likes: string[],
  isVerified: boolean
};