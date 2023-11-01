import { model, Schema } from "mongoose";
import { ConversationType } from "../config/conversationType.js";
;
const privateConversationSchema = new Schema({
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
}, { timestamps: true });
const PrivateConversation = model("PrivateConversation", privateConversationSchema);
export default PrivateConversation;
