import { Document, model, Schema } from "mongoose";
import { TFriendRequestTable } from "./type/FriendRequestTable";

export interface IFriendRequestTable extends TFriendRequestTable, Document {};

{/* 12 05 22 40 */}

const friendRequestTableSchema: Schema = new Schema(
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

const FriendAcceptReject = model<IFriendRequestTable>("FriendRequest", friendRequestTableSchema);

export default FriendAcceptReject;