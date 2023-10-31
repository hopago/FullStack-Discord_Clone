import dotenv from 'dotenv';

dotenv.config();

export type TUserInfo = {
    id: string,
    isVerified: boolean,
    type: number
}

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_KEY as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_KEY as string;