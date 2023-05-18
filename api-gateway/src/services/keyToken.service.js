import { BadRequestError } from "../core/error.response.js";
import KeyTokenRepository from "../pg/repository/keyToken.repository.js";

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const publicKeyString = await KeyTokenRepository.updateOrCreate({
      userId,
      publicKey,
      privateKey,
      refreshToken,
    });
    if (!publicKeyString) throw new BadRequestError("User not found!");
    return publicKeyString;
  };
}

export default KeyTokenService;
