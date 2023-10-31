import { model, Schema } from "mongoose";
;
const serverConversationSchema = new Schema({
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
}, { timestamps: true });
const ServerConversation = model("ServerConversation", serverConversationSchema);
export default ServerConversation;
