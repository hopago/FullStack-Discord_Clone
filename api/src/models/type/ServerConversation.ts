import { IServer } from "../Server";

export type TServerConversation = {
  messages_reference: {
    serverId: IServer["_id"];
    childCategory: IServer["custom_category"]["childCategory"];
  };
};
