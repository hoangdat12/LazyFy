import jwt from "jsonwebtoken";

import { asyncHandler } from "../helpers/asyncHandler.js";
import {
  BadRequestError,
  ForbiddenRequestError,
} from "../core/error.response.js";
import { findByUserId } from "../modelService/keyToken.model.service.js";
import { NotFoundError } from "../core/error.response.js";

const HEADER = {
  API_KEY: "x-api-key",
  // User id
  CLIENT_ID: "x-client-id",
  // Token
  AUTHORIZATION: "authorization",
};

const TIME_EXPIRES_ACCESS_TOKEN = "1 days"; // 15p
const TIME_EXPIRES_REFRESH_TOKEN = "15 days";

const createTokenPair = async ({ payload, privateKey }) => {
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

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // Get user ID from header
  const userId = req.header(HEADER.CLIENT_ID);
  if (!userId) {
    throw new BadRequestError("Missing request header!");
  }
  // Get key token
  const keyToken = await findByUserId({ userId });
  if (!keyToken) {
    throw new NotFoundError("User not found!");
  }

  const accessToken = req.header(HEADER.AUTHORIZATION);
  if (!accessToken) {
    throw new ForbiddenRequestError("Invalid Request!");
  }

  // const token = accessToken.substring(7);
  // if (!token) {
  //   throw new ForbiddenRequestError("Invalid Request!");
  // }
  try {
    // Decoded value from token with public Key
    const decoded = jwt.verify(accessToken, keyToken.publicKey, {
      algorithms: ["RS256"],
    });
    if (userId !== decoded.id) {
      throw new ForbiddenRequestError("Invalid token!");
    }
    console.log(decoded);
    req.keyToken = keyToken;
    req.user = decoded;
    return next();
  } catch (err) {
    console.log(err);
    throw new ForbiddenRequestError("Invalid token!");
  }
});

export { createTokenPair, verifyAccessToken };
