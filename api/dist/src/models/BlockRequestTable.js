import { model, Schema } from "mongoose";
{ /* 12 05 22 40 */ }
const blockRequestTableSchema = new Schema({
    referenced_user: {
        type: String,
        required: true,
        unique: true,
    },
    members: {
        type: [Object],
        default: [],
    },
}, { timestamps: true });
const BlackList = model("BlackList", blockRequestTableSchema);
export default BlackList;
