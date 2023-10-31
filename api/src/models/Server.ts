import { Document, model, Schema } from "mongoose";
import { TServer } from "./type/Server";

export interface IServer extends TServer, Document {};

const serverSchema: Schema = new Schema(
  {
    members: {
      type: [String],
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
      authorId: { type: String, required: true, unique: true },
      userName: { type: String, required: true, unique: true },
      avatar: { type: String },
    },
    embeds: {
      server_category: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      thumbnail: { type: String },
    },
    likes: {
      type: [String],
      default: []
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Server = model<IServer>("Server", serverSchema);

export default Server;