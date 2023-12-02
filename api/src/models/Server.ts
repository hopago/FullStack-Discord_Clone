import { Document, model, Schema } from "mongoose";
import { IUser } from "./User";

export interface IServer extends Document {
  members: IUser[];
  custom_category: {
    parentCategory: string;
    childCategory: string[];
  };
  author: {
    authorId: string;
    userName: IUser["userName"];
    avatar: IUser["avatar"];
  };
  embeds: {
    server_category: string;
    title: string;
    description: string;
    thumbnail: string;
  };
  likes: string[];
  isVerified: boolean;
}

const serverSchema: Schema = new Schema(
  {
    members: {
      type: [Object],
      required: true,
    },
    custom_category: {
      parentCategory: { type: String, required: true, default: "Welcome" },
      childCategory: {
        type: [String],
        default: ["introductions", "announcements", "rules"],
      },
    },
    author: {
      authorId: { type: String },
      userName: { type: String },
      avatar: { type: String },
    },
    embeds: {
      server_category: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      thumbnail: { type: String },
    },
    likes: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Server = model<IServer>("Server", serverSchema);

export default Server;
