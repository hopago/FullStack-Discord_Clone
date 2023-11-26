import { Document, model, Schema } from "mongoose";
import { TUser } from "./type/User.js";
import { UserType } from "../config/userType.js";

export interface IUser extends TUser, Document {};

const userSchema: Schema = new Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    banner: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    language: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    type: {
        type: Number,
        default: UserType[1].number,
    },
    friends: {
        type: [Object],
        default: []
    },
    blackList: {
        type: [Object],
        default: []
    },
    refreshToken: {
        type: [String],
    },
    tag: {
        type: Number,
        default: Math.floor(Math.random() * 90000) + 10000
    }
}, {timestamps: true});

const User = model<IUser>("User", userSchema);

export default User;