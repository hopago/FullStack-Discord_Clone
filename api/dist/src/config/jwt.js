import dotenv from 'dotenv';
dotenv.config();
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_KEY;
