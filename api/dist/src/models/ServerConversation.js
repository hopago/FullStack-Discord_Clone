import { model, Schema } from "mongoose";
import { ConversationType } from "../config/conversationType.js";
;
const serverConversationSchema = new Schema({
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
}, { timestamps: true });
const ServerConversation = model("ServerConversation", serverConversationSchema);
export default ServerConversation;
