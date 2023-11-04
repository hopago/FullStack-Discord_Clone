import { model, Schema } from "mongoose";
;
const postSchema = new Schema({
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
    views: {
        type: Number,
        default: 0
    },
    reactions: {
        thumbsUp: {
            type: [String],
            default: [],
        },
        wow: {
            type: [String],
            default: [],
        },
        heart: {
            type: [String],
            default: [],
        },
        rocket: {
            type: [String],
            default: [],
        },
        coffee: {
            type: [String],
            default: [],
        }
    }
}, { timestamps: true });
const Post = model("Post", postSchema);
export default Post;
