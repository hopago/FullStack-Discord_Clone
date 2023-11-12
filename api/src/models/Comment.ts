import { Document, model, Schema } from "mongoose";
import { TComment } from "./type/Comment";

export interface IComment extends TComment, Document {};

const commentSchema: Schema = new Schema(
  {
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
          },
        },
        description: {
          type: String,
          required: true,
        },
        comment_like_count: {
          type: [String],
          default: [],
        },
        comment_reply: [
          {
            referenced_comment: {
              type: String,
              required: true,
            },
            user: {
              userId: {
                type: String,
              },
              userName: {
                type: String,
              },
              avatar: {
                type: String,
              },
            },
            description: {
              type: String,
            },
            reply_like_count: {
              type: Number,
              default: 0,
            },
            createdAt: {
              type: Date,
              default: new Date(),
            },
            updatedAt: {
              type: Date,
              default: new Date(),
            }
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;