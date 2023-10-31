import { TUser } from "./User";

export type TBlockRequestTable = {
    table: {
        referenced_user: string,
        members: [TUser],
    }
}