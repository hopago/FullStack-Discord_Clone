import { TUser } from "./User";

export type TPrivateConversation = {
    type: number,
    members: [Object: TUser],
    // temporary setting -> should be "_id"
    id: string,
};