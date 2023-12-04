import { Document, model, Schema } from "mongoose";

export interface IMemo extends Document {
    referenced_user: string,
    friendId: string,
    memo: string
}

const memoSchema: Schema = new Schema({
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
}, {timestamps: true});

const Memo = model<IMemo>("Memo", memoSchema);

export default Memo;