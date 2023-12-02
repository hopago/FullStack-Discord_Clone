import { Request, Response, NextFunction } from "express";
import { HttpException } from "../middleware/error/utils.js";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt, { Secret, VerifyErrors } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/jwt.js";
import FriendAcceptReject, { IFriendRequestTable } from "../models/FriendRequestTable.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName, password, email } = req.body;

    if (!userName || !password || !email)
      throw new HttpException(400, "UserName, Email, Password are required...");

    const duplicate = await User.findOne({
      userName,
    });
    if (duplicate) throw new HttpException(409, "");

    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    await newUser.save();

    const userId = newUser._id?.toString();
    let newFriendRequestTable: IFriendRequestTable;

    if (typeof userId === "string") {
      newFriendRequestTable = new FriendAcceptReject({
        referenced_user: userId
      });
      await newFriendRequestTable.save();
    } else {
      return res.sendStatus(500).json("Something went wrong in userId...");
    }

    res.status(201).json("User has been created...");
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;

  try {
    const { userName, password } = req.body;
    if (!userName || !password)
      throw new HttpException(400, "UserName and Password are required...");

    const user = await User.findOne({
      userName,
    });
    if (!user) throw new HttpException(400, "User not found...");

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return res.sendStatus(401);

    if (isCorrect) {
      const accessToken = jwt.sign(
        {
          userInfo: {
            id: user._id,
            isVerified: user.isVerified,
            type: user.type,
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
      );

      const newRefreshToken = jwt.sign(
        {
          userInfo: {
            id: user._id,
          },
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      let newRefreshTokenArray = !cookies?.jwt
        ? user.refreshToken
        : user.refreshToken.filter((rt: string) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        if (!foundToken) {
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      }

      user.refreshToken = [...newRefreshTokenArray, newRefreshToken];

      await user.save();

      res
        .cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ accessToken });
    }
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw new HttpException(204, "");
    const refreshToken = cookies.jwt;

    const user = await User.findOne({
      refreshToken,
    }).exec();
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(204);
    }

    user.refreshToken = user.refreshToken.filter((rt) => rt !== refreshToken);
    await user.save();

    res
      .clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  try {
    console.log(refreshToken);
    const user = await User.findOne({ refreshToken }).exec();
    console.log(user);

    if (!user) {
      jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET as Secret,
        async (err: VerifyErrors | null, decoded: any): Promise<void> => {
          if (err) res.sendStatus(403);

          const hackedUser = await User.findOne({
            _id: decoded.userInfo.id,
          }).exec();
          if (hackedUser) {
            hackedUser.refreshToken = [];
            await hackedUser?.save();
          }
        }
      );
      return res.sendStatus(403);
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    jwt.verify(
      refreshToken as string,
      REFRESH_TOKEN_SECRET as Secret,
      async (err: VerifyErrors | null, decoded: any): Promise<void> => {
        if (err || decoded.userInfo.id !== user._id) {
          user.refreshToken = [...newRefreshTokenArray];
          await user.save();

          if (err) res.sendStatus(403);
          return;
        }

        const accessToken = jwt.sign(
          {
            userInfo: {
              id: user._id,
              isVerified: user.isVerified,
              type: user.type,
            },
          },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "3h" }
        );

        const newRefreshToken = jwt.sign(
          {
            userInfo: {
              id: user._id,
            },
          },
          REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await user.save();

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ accessToken });
      }
    );
  } catch (err) {
    next(err);
  }
};
