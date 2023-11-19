export type TUser = {
    type: number,
    description: string,
    language: string,
    email: string,
    password: string,
    isVerified: boolean,
    userName: string,
    avatar: string,
    banner: string,
    friends: [],
    blackList: [],
    refreshToken: string[],
    _doc: any
};