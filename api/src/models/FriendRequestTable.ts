import { Document, model, Schema } from "mongoose";
import { IUser } from "./User";

export interface IFriendRequestTable extends Document {
  referenced_user: string;
  members: IUser[];
  notifications: {
    senderInfo: {
      avatar: IUser["avatar"];
      userName: IUser["userName"];
    };
    type: "friendRequest_send" | "friendRequest_accept";
    isRead?: boolean;
  }[];
};

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
    notifications: [
      {
        senderInfo: {
          type: [Object],
          default: [],
        },
        type: {
          type: String,
          required: true,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const FriendAcceptReject = model<IFriendRequestTable>("FriendRequest", friendRequestTableSchema);

export default FriendAcceptReject;