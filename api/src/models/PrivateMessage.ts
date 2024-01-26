import { Document, model, Schema } from "mongoose";
import { TPrivateMessage } from "./type/PrivateMessage";

export interface IPrivateMessage extends TPrivateMessage, Document {};

const privateMessageSchema: Schema = new Schema(
  {
    numberOfMessage: {
      type: Number,
      default: 1,
    },
    referenced_conversation: {
      conversationId: {
        type: String,
        required: true,
      },
    },
    referenced_message: {
      content: {
        imgUrl: {
          type: String,
        },
        message: {
          type: String,
          required: true,
        },
      },
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
        required: true,
      },
    },
  },
  { timestamps: true }
);

const PrivateMessage = model<IPrivateMessage>("ServerMessage", privateMessageSchema);

export default PrivateMessage;