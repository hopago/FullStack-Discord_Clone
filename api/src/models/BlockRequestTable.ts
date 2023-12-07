import { Document, model, Schema } from "mongoose";
import { TBlockRequestTable } from "./type/BlockRequestTable";

export interface IBlockRequestTable extends TBlockRequestTable, Document {}

{/* 12 05 22 40 */}

const blockRequestTableSchema: Schema = new Schema(
  {
    referenced_user: {
      type: String,
      required: true,
      unique: true,
    },
    members: {
      type: [Object],
      default: [],
    },
  },
  { timestamps: true }
);

const BlackList = model<IBlockRequestTable>(
  "BlackList",
  blockRequestTableSchema
);

export default BlackList;
