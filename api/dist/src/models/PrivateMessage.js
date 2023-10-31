import { model, Schema } from "mongoose";
;
const privateMessageSchema = new Schema({
    numberOfMessage: {
        type: Number,
        default: 1
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
        author: {
            userId: {
                type: String,
            },
            userName: {
                type: String,
            },
            avatar: {
                type: String,
            },
        },
    },
});
const PrivateMessage = model("ServerMessage", privateMessageSchema);
export default PrivateMessage;
