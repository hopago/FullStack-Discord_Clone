import { model, Schema } from "mongoose";
;
{ /* 12 05 22 40 */ }
const friendRequestTableSchema = new Schema({
    referenced_user: {
        type: String,
        required: true,
        unique: true,
    },
    members: {
        type: [Object],
        default: [],
    },
    notifications: [
        {
            senderInfo: {
                type: [Object],
                default: [],
            },
            type: {
                type: String,
                required: true,
            },
            isRead: {
                type: Boolean,
                default: false,
            },
        },
    ],
}, { timestamps: true });
const FriendAcceptReject = model("FriendRequest", friendRequestTableSchema);
export default FriendAcceptReject;
