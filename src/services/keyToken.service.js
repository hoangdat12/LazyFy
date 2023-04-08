import _KeyToken from "../models/keyToken.model.js";

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const fillter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await _KeyToken.findOneAndUpdate(fillter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
}

export default KeyTokenService;
