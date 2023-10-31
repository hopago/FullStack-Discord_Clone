import { TUser } from "./User";

export type TPrivateConversation = {
    type: string,
    members: TUser[],
    senderId: string,
    receiverId: string,
    readBySender: boolean,
    readByReceiver: boolean,
    lastMessageNumber: number,
    lastMessage: string
};