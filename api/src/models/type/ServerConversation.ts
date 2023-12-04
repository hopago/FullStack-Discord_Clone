import { IServer } from "../Server";

export type TServerConversation = {
  type: string,
  messages_referenced: {
    serverId: IServer["_id"];
    childCategory: IServer["custom_category"]["0"]["childCategory"]
  };
  lastMessageNumber: number,
};
