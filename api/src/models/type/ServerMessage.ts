import { TServerConversation } from "./ServerConversation";
import { IUser } from "../User";

export type TServerMessage = {
  referenced_conversation: {
    serverId: string;
    childCategory: TServerConversation["messages_referenced"]["childCategory"];
  };
  referenced_message: {
    content: object;
    author: {
      userId: string;
      userName: IUser["userName"];
      avatar: IUser["avatar"];
    };
  };
  lastMessageNumber: number;
};
