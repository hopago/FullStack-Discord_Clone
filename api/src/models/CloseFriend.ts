import { Document, model, Schema } from "mongoose";
import { IUser } from "./User";

export interface ICloseFriend extends Document {
  referencedUser: IUser["_id"];
  closeFriends: Pick<IUser, "avatar" | "userName" | "language" | "_id">[];
};

const closeFriendSchema: Schema = new Schema(
  {
    referencedUser: {
      type: String,
      required: true,
    },
    closeFriends: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const CloseFriend = model<ICloseFriend>("CloseFriend", closeFriendSchema);

export default CloseFriend;