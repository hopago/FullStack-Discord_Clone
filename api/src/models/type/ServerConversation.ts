<<<<<<< HEAD
import { IServer } from "../Server";

export type TServerConversation = {
  type: string,
  messages_referenced: {
    serverId: IServer["_id"];
    childCategory: IServer["custom_category"]["childCategory"];
  };
  lastMessageNumber: number,
};
=======
import { IServer } from "../Server";

export type TServerConversation = {
  messages_reference: {
    serverId: IServer["_id"];
    childCategory: IServer["custom_category"]["childCategory"];
  };
};
>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
