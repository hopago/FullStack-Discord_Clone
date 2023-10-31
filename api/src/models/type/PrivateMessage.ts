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
};