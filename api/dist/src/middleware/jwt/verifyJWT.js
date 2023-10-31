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
    var _a, _b;
    const userToken = (_b = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) !== null && _b !== void 0 ? _b : null;
    if (userToken === "null" || !userToken)
        throw new HttpException(401, "Unauthorized...");
    try {
        jwt.verify(userToken, ACCESS_TOKEN_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw new HttpException(403, "Token is not found...");
            req.user = decoded.userInfo;
            next();
        }));
    }
    catch (_c) {
        throw new HttpException(400, "Not allowed token...");
    }
};
