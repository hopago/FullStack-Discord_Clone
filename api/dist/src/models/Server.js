import { model, Schema } from "mongoose";
const serverSchema = new Schema({
    members: {
        type: [Object],
        required: true,
    },
    custom_category: [
        {
            parentCategory: { type: String, required: true, default: "Welcome" },
            childCategory: {
                type: [String],
                default: ["introductions", "announcements", "rules"],
            },
        },
    ],
    author: {
        authorId: { type: String, required: true },
        userName: { type: String, required: true },
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
}, { timestamps: true });
const Server = model("Server", serverSchema);
export default Server;
