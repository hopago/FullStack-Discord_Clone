import { model, Schema } from "mongoose";
;
const serverMessageSchema = new Schema({
    referenced_conversation: {
        serverId: {
            type: String,
            required: true,
        },
        childCategory: {
            type: [String],
            required: true,
        },
    },
    referenced_message: {
        content: {
            type: Object,
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
            avatar: {
                type: String,
            },
        },
    },
    numberOfMessage: {
        type: Number,
        default: 1
    }
}, { timestamps: true });
const ServerMessage = model("ServerMessage", serverMessageSchema);
export default ServerMessage;
