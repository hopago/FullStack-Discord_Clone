import { Document, model, Schema } from "mongoose";
import { TFriendRequestTable } from "./type/FriendRequestTable";

export interface IFriendRequestTable extends TFriendRequestTable, Document {};

const friendRequestTableSchema: Schema = new Schema(
  {
    referenced_user: {
      type: String,
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