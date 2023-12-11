import { IUser } from "../User";

export type TPrivateConversation = {
    type: string,
    members: IUser[],
    senderId: string,
    receiverId: string,
    readBySender: boolean,
    readByReceiver: boolean,
    lastMessageNumber: number,
    lastMessage: string
};