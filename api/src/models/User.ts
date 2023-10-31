<<<<<<< HEAD
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
        type: [String],
        default: []
    },
    blackList: {
        type: [String],
        default: []
    }
}, {timestamps: true});

const User = model<IUser>("User", userSchema);

=======
import { Document, model, Schema } from "mongoose";
import { TUser } from "./type/User";
import { UserType } from "../config/userType";

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
    email: {
        type: String,
        required: true,
        unique: true
    },
    description: {

    },
    language: {
        type: [String],
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
        type: [String],
        default: []
    }
}, {timestamps: true});

const User = model<IUser>("User", userSchema);

>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
export default User;