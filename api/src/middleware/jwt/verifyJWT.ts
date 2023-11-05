import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../error/utils.js';
import { ACCESS_TOKEN_SECRET } from '../../config/jwt.js';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const userToken = req.headers["authorization"]?.split(" ")[1];
  if (userToken === null || !userToken) return res.sendStatus(401);

  try {
    jwt.verify(
      userToken,
      ACCESS_TOKEN_SECRET,
      async (err: VerifyErrors | null, decoded: any): Promise<void> => {
        if (err) {
          res.sendStatus(403);
          return;
        }
        req.user = await decoded.userInfo;
        next();
      }
    );
  } catch {
    res.sendStatus(400);
    throw new HttpException(400, "Not allowed token...");
  }
};