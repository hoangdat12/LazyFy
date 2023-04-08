import { Types } from "mongoose";

import _KeyToken from "../models/keyToken.model.js";

const findByUserId = ({ userId }) => {
  return _KeyToken.findOne({ user: userId }).lean();
};

const removeKeyTokenById = ({ id }) => {
  return _KeyToken.deleteOne(id);
};

const findKeyTokenUsedByRefreshToken = ({ refreshToken }) => {
  return _KeyToken.findOne({ refreshTokensUsed: refreshToken }).lean();
};

const deleteKeyTokenById = ({ id }) => {
  return _KeyToken.delete({ id }).lean();
};

const findKeyTokenByRefreshToken = ({ refreshToken }) => {
  return _KeyToken.findOne({ refreshToken });
};

export {
  findByUserId,
  removeKeyTokenById,
  findKeyTokenUsedByRefreshToken,
  deleteKeyTokenById,
  findKeyTokenByRefreshToken,
};
