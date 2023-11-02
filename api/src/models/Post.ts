import { Document, model, Schema } from "mongoose";
import { TPost } from "./type/Post.js";

export interface IPost extends TPost, Document {};

const postSchema: Schema = new Schema(
    {
        author: {
            authorId: {
                type: String,
                required: true
            },
            userName: {
                type: String,
                required: true
            },
            avatar: {
                type: String
            }
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imgUrl: {
            type: String
        },
        category: {
            type: [String],
            default: [],
            required: true
        },
        likes: {
            type: [String],
            default: []
        },
        dislikes: {
            type: [String],
            default: []
        },
        views: {
            type: Number,
            default: 0
        },
        reactions: {
            thumbsUp: {
                type: Number,
                default: 0
            },
            wow: {
                type: Number,
                default: 0
            },
            heart: {
                type: Number,
                default: 0
            },
            rocket: {
                type: Number,
                default: 0
            },
            coffee: {
                type: Number,
                default: 0
            }
        }
    },
    { timestamps: true }
);

const Post = model<IPost>("Post", postSchema);

export default Post;