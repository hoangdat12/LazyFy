import jwt from "jsonwebtoken";

import { asyncHandler } from "../helpers/asyncHandler.js";
import {
  BadRequestError,
  ForbiddenRequestError,
} from "../core/error.response.js";
import { NotFoundError } from "../core/error.response.js";
import KeyTokenRepository from "../pg/repository/keyToken.repository.js";
import UserRepository from "../pg/repository/user.repository.js";

const HEADER = {
  API_KEY: "x-api-key",
  // User id
  CLIENT_ID: "x-client-id",
  // Token
  AUTHORIZATION: "authorization",
};

const TIME_EXPIRES_ACCESS_TOKEN = "1 days"; // 15p
const TIME_EXPIRES_REFRESH_TOKEN = "15 days";

class JwtService {
  static createTokenPair = async ({ payload, privateKey }) => {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: TIME_EXPIRES_ACCESS_TOKEN,
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: TIME_EXPIRES_REFRESH_TOKEN,
    });
    return { accessToken, refreshToken };
  };

  static verifyAccessToken = asyncHandler(async (req, res, next) => {
    // Get user ID from header
    let userId = req.header(HEADER.CLIENT_ID);
    userId = parseInt(userId);
    if (!userId) {
      throw new BadRequestError("Missing request header!");
    }
    // Check user exist or not
    const userExist = await UserRepository.findById({ userId });
    if (!userExist) throw new NotFoundError("User not found!");
    // Get key token
    const keyToken = await KeyTokenRepository.findByUserId({ userId });
    if (!keyToken) {
      throw new NotFoundError("User not found!");
    }

    const accessToken = req.header(HEADER.AUTHORIZATION);
    if (!accessToken) {
      throw new ForbiddenRequestError("Invalid Request!");
    }
    try {
      // Decoded value from token with public Key
      const decoded = jwt.verify(accessToken, keyToken.public_key, {
        algorithms: ["RS256"],
      });
      if (userId !== decoded.id) {
        throw new ForbiddenRequestError("Invalid token!");
      }

      req.keyToken = keyToken;
      req.user = decoded;
      return next();
    } catch (err) {
      console.log(err);
      throw new ForbiddenRequestError("Invalid token!");
    }
  });
}

export default JwtService;
