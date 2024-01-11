import { model, Schema } from "mongoose";
;
const closeFriendSchema = new Schema({
    referencedUser: {
        type: String,
        required: true,
    },
    closeFriends: {
        type: Array,
        default: [],
    },
}, { timestamps: true });
const CloseFriend = model("CloseFriend", closeFriendSchema);
export default CloseFriend;
