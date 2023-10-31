import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../error/utils.js';
import { ACCESS_TOKEN_SECRET } from '../../config/jwt.js';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const userToken = req.headers["authorization"]?.split(" ")[1] ?? null;
  if (userToken === "null" || !userToken)
    throw new HttpException(401, "Unauthorized...");

  try {
    jwt.verify(
      userToken,
      ACCESS_TOKEN_SECRET,
      async (err: VerifyErrors | null, decoded: any): Promise<void> => {
        if (err) throw new HttpException(403, "Token is not found...");
        req.user = decoded.userInfo;
        next();
      }
    );
  } catch {
    throw new HttpException(400, "Not allowed token...");
  }
};