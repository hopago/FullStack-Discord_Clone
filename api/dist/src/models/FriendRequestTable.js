import { model, Schema } from "mongoose";
;
const friendRequestTableSchema = new Schema({
    table: {
        referenced_user: {
            type: String,
        },
        members: {
            type: [Object],
            default: [],
        },
    },
});
const FriendAcceptReject = model("FriendRequest", friendRequestTableSchema);
export default FriendAcceptReject;
