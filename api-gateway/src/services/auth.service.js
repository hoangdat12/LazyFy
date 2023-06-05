import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Jwt from 'jsonwebtoken';

import KeyTokenService from './keyToken.service.js';
import {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenRequestError,
} from '../core/error.response.js';
import { OK, CREATED } from '../core/success.response.js';
import UserRepository from '../pg/repository/user.repository.js';
import JwtService from './jwt.service.js';
import KeyTokenRepository from '../pg/repository/keyToken.repository.js';

class AuthService {
  static signUp = async ({ fullName, email, password }) => {
    const isExist = await UserRepository.findByEmail({ email });
    if (isExist) {
      throw new ConflictRequestError('Error: Email is already Exist!');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.create({
      fullName,
      email,
      password: hashPassword,
    });

    let metadata = null;
    let message = '';

    if (newUser) {
      const { privateKey, publicKey } = this.generatePrivatePublicKey();

      const { accessToken, refreshToken } = await JwtService.createTokenPair({
        payload: {
          id: newUser.id,
          email: newUser.email,
        },
        privateKey,
      });

      await KeyTokenService.createKeyToken({
        userId: newUser.id,
        publicKey,
        privateKey,
        refreshToken,
      });

      metadata = {
        user: newUser,
        token: accessToken,
      };
      message = 'Create Account Success!';
      return {
        refreshToken,
        response: new CREATED(metadata, message),
      };
    } else {
      message = 'Create Account Failure!';
      return {
        refreshToken: null,
        response: new OK(metadata, message),
      };
    }
  };

  static login = async ({ email, password }) => {
    const user = await UserRepository.findByEmail({ email });
    if (!user) {
      throw new BadRequestError('User not register!');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AuthFailureError('Authorization Error!');
    }

    const { privateKey, publicKey } = this.generatePrivatePublicKey();

    const { accessToken, refreshToken } = await JwtService.createTokenPair({
      payload: {
        id: user.id,
        email: user.email,
      },
      privateKey,
    });

    await KeyTokenService.createKeyToken({
      userId: user.id,
      publicKey,
      privateKey,
      refreshToken,
    });

    const metadata = {
      user,
      token: accessToken,
    };
    const message = 'Login success!';
    return {
      refreshToken,
      response: new OK(metadata, message),
    };
  };

  static logout = async ({ keyTokenId }) => {
    const delKey = await KeyTokenRepository.deleteById({
      keyTokenId,
    });
    return delKey;
  };

  static refreshToken = async ({ token }) => {
    // Check refreshToken is Used?
    const foundToken = await KeyTokenRepository.findByRefreshTokenUsed({
      refreshToken: token,
    });
    if (foundToken) {
      // Check user use this refresh Token
      const { id, email } = Jwt.verify(token, foundToken.publicKey, {
        algorithm: 'RS256',
      });
      console.log(`Refresh Token is used::::userEmail:${email}:::id:${id}"`);
      // Delete All KeyToken
      await KeyTokenRepository.deleteById(foundToken.id);
      throw new ForbiddenRequestError(
        'Something wrong happend, Please relogin!'
      );
    }
    const holderToken = await KeyTokenRepository.findByRefershToken({
      refreshToken: token,
    });
    if (!holderToken) throw new BadRequestError('Invalid Token!');
    const { id, email } = Jwt.verify(token, holderToken.public_key, {
      algorithm: 'RS256',
    });

    const isValidUser = await UserRepository.findById({ userId: id });
    if (!isValidUser) throw new BadRequestError('User not found!');

    const { accessToken, refreshToken } = await JwtService.createTokenPair({
      payload: { id, email },
      privateKey: holderToken.private_key,
    });
    // This error
    await KeyTokenRepository.updateByUserId({
      userId: id,
      newRefreshToken: refreshToken,
      olderRefreshToken: token,
    });

    return {
      user: { id, email },
      accessToken,
      refreshToken,
    };
  };

  //   // Not fixed yet
  //   static changePasswordWithEmail = async ({ email }) => {
  //     const userExist = await UserRepository.findByEmail({ email });
  //     if (!userExist) {
  //       throw new BadRequestError("email not found!");
  //     }
  //     // Create Otp
  //     const otp = crypto.randomInt(1000000);
  //     const otpString = otp.toString().padStart(6, "0");
  //     // Save Otp
  //     const newOtp = await createOtp({ email, otp: otpString, secret: null });
  //     console.log(newOtp);
  //     if (!newOtp) {
  //       throw new InternalServerError("Db error!");
  //     }
  //     // Send Otp to Email
  //     // sendMail({
  //     //   email,
  //     //   content: changePasswordTemplate,
  //     //   subject: "Verify Email Change Password",
  //     // });
  //     const messgae =
  //       "We have sent a notification to your email for verification, please follow the instructions to change your password.";
  //     return new OK(messgae);
  //   };

  //   static verifyEmail = async ({ email, otp }) => {
  //     // Verify Otp
  //     // 1. Get Otp from Db
  //     // 2. Verify
  //     const otpVerify = await findOtpByEmail({ email });
  //     if (!otpVerify) {
  //       throw new BadRequestError("Invalid email!");
  //     }
  //     if (otp !== otpVerify.otp) {
  //       throw new BadRequestError("Invalid otp!");
  //     }
  //     // Create Uri
  //     const token = crypto.randomBytes(10).toString("hex");
  //     console.log(token);
  //     const uri = `http://localhost:8080/api/v1/auth/change-password/${token}`;
  //     // Create secret key
  //     const query = { email };
  //     const update = { secret: token };
  //     await findOneAndUpdateOtp(query, update);

  //     return new OK("Success!", {
  //       uri,
  //     });
  //   };

  //   static changePassword = async ({
  //     email,
  //     olderPassword,
  //     password,
  //     codeSecret,
  //   }) => {
  //     // Check code invalid or not
  //     const otp = await findOtpByEmail({ email });
  //     if (!otp) {
  //       throw new BadRequestError("Otp expires!");
  //     }
  //     console.log(otp, codeSecret);
  //     if (otp.secret !== codeSecret) {
  //       throw new BadRequestError("Request not found!");
  //     }

  //     // Check user
  //     const user = await findUserByEmail({ email });
  //     if (!user) {
  //       throw new BadRequestError("Email not register!");
  //     }

  //     // Check password
  //     const isValid = await bcrypt.compare(olderPassword, user.password);
  //     if (!isValid) {
  //       throw new BadRequestError("Invalid older password!");
  //     }
  //     // Change password
  //     // Error
  //     const hashPassword = bcrypt.hashSync(password, 10);
  //     const query = { email: email };
  //     const update = { password: hashPassword };
  //     const userUpdate = await findOneAndUpdateUser(query, update);
  //     if (!userUpdate) {
  //       throw new InternalServerError("DB error!");
  //     }
  //     return new OK("Change password success!");
  //   };

  static generatePrivatePublicKey = () => {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
  };
}
export default AuthService;
