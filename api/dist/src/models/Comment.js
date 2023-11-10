import { model, Schema } from "mongoose";
;
const commentSchema = new Schema({
    comments: [
        {
            postId: {
                type: String,
                required: true,
            },
            author: {
                authorId: {
                    type: String,
                    required: true,
                },
                userName: {
                    type: String,
                    required: true,
                },
                avatar: {
                    type: String,
                }
            },
            description: {
                type: String,
                required: true,
            },
            comment_like_count: {
                type: [String],
                default: []
            },
            comment_reply: {
                user: {
                    userId: {
                        type: String,
                    },
                    userName: {
                        type: String,
                    },
                    avatar: {
                        type: String,
                    }
                },
                description: {
                    type: String,
                },
                reply_like_count: {
                    type: Number,
                    default: 0
                }
            }
        }
    ]
}, { timestamps: true });
const Comment = model("Comment", commentSchema);
export default Comment;
