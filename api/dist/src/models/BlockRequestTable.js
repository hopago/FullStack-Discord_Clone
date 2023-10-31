import { model, Schema } from "mongoose";
;
const blockRequestTableSchema = new Schema({
    table: {
        referenced_user: {
            type: String,
        },
        members: {
            type: [Object],
            default: []
        },
    },
});
const BlackList = model("BlackList", blockRequestTableSchema);
export default BlackList;
