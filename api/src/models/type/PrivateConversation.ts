<<<<<<< HEAD
import { TUser } from "./User";

export type TPrivateConversation = {
    type: string,
    members: [Object: TUser],
    senderId: string,
    receiverId: string,
    readBySender: boolean,
    readByReceiver: boolean,
    lastMessageNumber: number,
    lastMessage: string
=======
import { TUser } from "./User";

export type TPrivateConversation = {
    type: number,
    members: [Object: TUser],
    // temporary setting -> should be "_id"
    id: string,
>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
};