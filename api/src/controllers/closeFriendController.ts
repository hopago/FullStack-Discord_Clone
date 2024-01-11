import { NextFunction, Request, Response } from "express"
import { getCloseFriendsArray } from "../services/closeFriends/getCloseFriend.js";
import { addCloseFriend as services_addCloseFriend } from "../services/closeFriends/addCloseFriend.js";
import { removeCloseFriend as services_removeCloseFriend } from '../services/closeFriends/removeCloseFriend.js'

export const getCloseFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const closeFriends = await getCloseFriendsArray(req, res, next);

        return res.status(200).json(closeFriends);
    } catch (err) {
        next(err);
    }
};

export const addCloseFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedCloseFriends = await services_addCloseFriend(req, res, next);

        return updatedCloseFriends;
    } catch (err) {
        next(err);
    }
};

export const removeCloseFriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedCloseFriends = await services_removeCloseFriend(req, res, next);

        return updatedCloseFriends;
    } catch (err) {
        next(err);
    }
};