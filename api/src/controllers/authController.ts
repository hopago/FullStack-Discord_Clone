import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import jwt, { Secret, VerifyErrors } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/jwt.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
            ...req.body,
            password: hash,
        });
        await newUser.save();
        res.status(201).json("User has been created...");
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({
            userName: req.body.userName
        });
        if (!user) throw new HttpException(404, "User not found...");
        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isCorrect) throw new HttpException(400, "Wrong Creds...");

        const accessToken = jwt.sign(
          {
            userInfo: {
                id: user._id,
                isVerified: user.isVerified,
                type: user.type,
            }
          },
          ACCESS_TOKEN_SECRET,
          // { expiresIn: '15m' }
          { expiresIn: '10s' } // for dev
        );

        const refreshToken = jwt.sign(
          {
            userInfo: {
                id: user._id,
            }
          },
          REFRESH_TOKEN_SECRET,
          // { expiresIn: '7d' }
          { expiresIn: '15s' } // for dev
        );

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            // maxAge: 7 * 24 * 60 * 60 * 1000
            maxAge: 30 * 1000 // for dev
        })
        .status(200)
        .json({ accessToken });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) throw new HttpException(204, "");
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })
        .status(200)
        .json({ message: 'Cookie cleared...' });
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) throw new HttpException(401, "Unauthorized...");
        const refreshToken = cookies.jwt;

        jwt.verify(
            refreshToken as string,
            REFRESH_TOKEN_SECRET as Secret,
            async (err: VerifyErrors | null, decoded: any): Promise<void> => {
                if (err) throw new HttpException(403, "Token is not valid...");

                const foundUser = await User.findOne({
                    _id: decoded.userInfo.id
                }).exec();
                if (!foundUser) throw new HttpException(401, "Unauthorized...");

                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            id: foundUser._id,
                            isVerified: foundUser.isVerified,
                            type: foundUser.type,
                        }
                    },
                    ACCESS_TOKEN_SECRET,
                    // { expiresIn: '15m' }
                    { expiresIn: '15s' }
                );

                res.status(200).json({ accessToken });
            }
        );
    } catch (err) {
        next(err);
    }
};