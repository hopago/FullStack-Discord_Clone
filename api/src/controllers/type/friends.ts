export interface IFriends {
    _id: string,
    userName: string,
    avatar: string,
    description: string,
    language: string
}

export interface IFriendRequestTable {
    _id: string,
    referenced_user: string,
    members: [string],
    checkAccept: boolean | null;
}