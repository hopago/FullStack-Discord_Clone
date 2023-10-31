<<<<<<< HEAD
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

=======
import { Document, model, Schema } from "mongoose";
import { TServerConversation } from "./type/ServerConversation";

export interface IServerConversation extends TServerConversation, Document {};

const serverConversationSchema: Schema = new Schema(
  {
    messages_reference: {
      serverId: {
        type: String,
        required: true,
      },
      childCategory: {
        type: String,
        required: true,
      },
    },
    lastMessage: {
      type: String, // limit 50
    },
  },
  { timestamps: true }
);

const ServerConversation = model<IServerConversation>("ServerConversation", serverConversationSchema);

>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
export default ServerConversation;