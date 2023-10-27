import { Document, model, Schema } from "mongoose";
import { TServerMessage } from "./type/ServerMessage";

export interface IServerMessage extends TServerMessage, Document {};

const serverMessageSchema: Schema = new Schema(
  {
    referenced_conversation: {
        serverId: {
            type: String,
            required: true,
        },
        childCategory: {
            type: [String],
            required: true,
        }
    },
    referenced_message: [
        {
            content: {
                type: [Object],
                required: true,
            },
            author: {
                userId: {
                    type: String,
                    required: true,
                },
                userName: {
                    type: String,
                    required: true,
                },
                avatars: {
                    type: String,
                }
            }
        }
    ]
  },
  { timestamps: true }
);

const ServerMessage = model<IServerMessage>("ServerMessage", serverMessageSchema);

export default ServerMessage;