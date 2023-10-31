import { Document, model, Schema } from "mongoose";
import { TBlockRequestTable } from "./type/BlockRequestTable";

export interface IBlockRequestTable extends TBlockRequestTable, Document {};

const blockRequestTableSchema: Schema = new Schema({
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

const BlackList = model<IBlockRequestTable>("BlackList", blockRequestTableSchema);

export default BlackList;