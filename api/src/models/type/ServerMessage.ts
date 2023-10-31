<<<<<<< HEAD
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
=======
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
>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
