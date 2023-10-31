import { Document, model, Schema } from "mongoose";
import { TPrivateConversation } from "./type/PrivateConversation.js";
import { ConversationType } from "../config/conversationType.js";

export interface IPrivateConversation extends TPrivateConversation, Document {};

const privateConversationSchema: Schema = new Schema(
    {
        type: {
            type: String,
            default: ConversationType[0]
        },
        members: {
            type: [Object],
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        receiverId: {
            type: String,
            required: true
        },
        readBySender: {
            type: Boolean,
            required: true
        },
        readByReceiver: {
            type: Boolean,
            required: true
        },
        lastMessageNumber: {
            type: Number,
            default: 0,
        },
        lastMessage: {
            type: String,
        }
    }
);

const PrivateConversation = model<IPrivateConversation>("PrivateConversation", privateConversationSchema);

export default PrivateConversation;