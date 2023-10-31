import { Document, model, Schema } from "mongoose";
import { TFriendRequestTable } from "./type/FriendRequestTable";

export interface IFriendRequestTable extends TFriendRequestTable, Document {};

const friendRequestTableSchema: Schema = new Schema({
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

const FriendAcceptReject = model<IFriendRequestTable>("FriendRequest", friendRequestTableSchema);

export default FriendAcceptReject;