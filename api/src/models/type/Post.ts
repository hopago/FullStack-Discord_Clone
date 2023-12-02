import { IUser } from "../User";

export type TPost = {
  author: {
    authorId: IUser["_id"];
    userName: IUser["userName"];
    avatar: IUser["avatar"];
  };
  title: string;
  description: string;
  category: string[];
  representativeImgUrl: string;
  imgUrlArr: string[];
  reactions: {
    [key: string]: [string];
  };
  views: number;
};
