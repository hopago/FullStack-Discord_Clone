import { IUser } from "../User";

export type TPost = {
    author: {
        authorId: IUser["_id"];
        userName: IUser["userName"];
        avatar: IUser["avatar"];
    },
    title: string,
    description: string,
    imgUrl: string,
    category: string[],
    reactions: {
        [key: string]: [string: IUser["_id"]];
    },
    views: number,
}