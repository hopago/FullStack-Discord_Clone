import { ObjectId } from "mongoose";
import { IUser } from "../User";

export type TUser = {
    _id: ObjectId,
    type: number,
    description: string,
    language: string,
    email: string,
    password: string,
    isVerified: boolean,
    userName: string,
    avatar: string,
    banner: string,
    friends: IUser[] | [],
    closeFriends: IUser[],
    blackList: [],
    refreshToken: string[],
    memo: string,
    _doc: any
};