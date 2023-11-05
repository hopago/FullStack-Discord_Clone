var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { HttpException } from '../error/utils.js';
import { ACCESS_TOKEN_SECRET } from '../../config/jwt.js';
export const verifyJWT = (req, res, next) => {
    var _a;
    const userToken = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (userToken === null || !userToken)
        return res.sendStatus(401);
    try {
        jwt.verify(userToken, ACCESS_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.sendStatus(403);
                return;
            }
            req.user = yield decoded.userInfo;
            next();
        }));
    }
    catch (_b) {
        res.sendStatus(400);
        throw new HttpException(400, "Not allowed token...");
    }
};
