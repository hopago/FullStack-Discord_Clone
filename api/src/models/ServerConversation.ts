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

export default ServerConversation;