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
    likes: [string: IUser["_id"]],
    dislikes: [string: IUser["_id"]],
    reactions: {
        [key: string]: number;
    },
    views: number,
}