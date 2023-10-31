import { TServerConversation } from "./ServerConversation";
import { IUser } from "../User";

export type TServerMessage = {
  referenced_conversation: {
    serverId: TServerConversation["messages_referenced"]["serverId"];
    childCategory: TServerConversation["messages_referenced"]["childCategory"];
  };
  referenced_message: {
    content: object;
    author: {
      userId: IUser["_id"];
      userName: IUser["userName"];
      avatar: IUser["avatar"];
    };
  };
  lastMessageNumber: number;
};
