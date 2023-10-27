import { TServerConversation } from "./ServerConversation";
import { IUser } from "../User";

export type TServerMessage = {
  referenced_conversation: {
    serverId: TServerConversation["messages_reference"]["serverId"];
    childCategory: TServerConversation["messages_reference"]["childCategory"];
  };
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
