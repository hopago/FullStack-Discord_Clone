import { model, Schema } from "mongoose";
;
const friendRequestTableSchema = new Schema({
    referenced_user: {
        type: String,
        unique: true,
    },
    members: {
        type: [Object],
        default: [],
    },
}, { timestamps: true });
const FriendAcceptReject = model("FriendRequest", friendRequestTableSchema);
export default FriendAcceptReject;
