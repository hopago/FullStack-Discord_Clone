import { Document, model, Schema } from "mongoose";
import { TServerConversation } from "./type/ServerConversation.js";
import { ConversationType } from "../config/conversationType.js";

export interface IServerConversation extends TServerConversation, Document {};

const serverConversationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      default: ConversationType[1]
    },
    messages_referenced: {
      serverId: {
        type: String,
        required: true,
      },
      childCategory: {
        type: String,
        required: true,
      },
    },
    lastMessageNumber: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const ServerConversation = model<IServerConversation>("ServerConversation", serverConversationSchema);

export default ServerConversation;