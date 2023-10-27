import { IUser } from "../User";
import { TPrivateConversation } from "./PrivateConversation";

export type TPrivateMessage = {
    referenced_conversation: {
        conversationId: TPrivateConversation["id"]; // temporary setting -> should be "_id"
    },
    referenced_message: [
        {
            content: [Object];
            author: {
                userId: IUser["_id"];
                userName: string;
                avatar: string;
            };
        }
    ];
};