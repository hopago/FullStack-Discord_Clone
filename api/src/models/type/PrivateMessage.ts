<<<<<<< HEAD
import { IUser } from "../User";
import { IPrivateConversation } from "../PrivateConversation";

export type TPrivateMessage = {
  numberOfMessage: number;
  referenced_conversation: {
    conversationId: IPrivateConversation["_id"];
  };
  referenced_message: {
    content: {
      imgUrl: string,
      message: string,
    };
    author: {
      userId: IUser["_id"];
      userName: IUser["userName"];
      avatar: IUser["avatar"];
    };
  };
=======
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
>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
};