import { model, Schema } from "mongoose";
const memoSchema = new Schema({
    referenced_user: {
        type: String,
        required: true,
        unique: true
    },
    friendId: {
        type: String,
        required: true
    },
    memo: {
        type: String,
        required: true
    }
}, { timestamps: true });
const Memo = model("Memo", memoSchema);
export default Memo;
